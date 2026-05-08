from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import sqlite3
import pandas as pd
import os
from datetime import datetime
import random

app = Flask(__name__)

# CORS configuration
CORS(app, 
     supports_credentials=True,
     origins=["http://localhost:5173", "http://localhost:3000"],
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

@app.before_request
def handle_options():
    if request.method == 'OPTIONS':
        response = app.make_default_options_response()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response

bcrypt = Bcrypt(app)
app.config['JWT_SECRET_KEY'] = 'super-secret-key-change-this'
jwt = JWTManager(app)

# ------------------------------------------------------------------
# Database helpers
def get_db():
    os.makedirs('database', exist_ok=True)
    conn = sqlite3.connect('database/cricket.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    os.makedirs('database', exist_ok=True)
    conn = get_db()
    conn.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )''')
    conn.execute('''CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        team_a TEXT,
        team_b TEXT,
        predicted_winner TEXT,
        prediction_date TEXT,
        match_date TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )''')
    conn.commit()
    conn.close()

init_db()
# ------------------------------------------------------------------

# Helper to load and preprocess past matches
def load_past_matches():
    csv_path = 'data/past_matches.csv'
    if not os.path.exists(csv_path):
        return None
    
    df = pd.read_csv(csv_path, encoding='utf-8-sig')
    
    # If the CSV already has team names (old format), just fix date and return
    if 'team1' in df.columns and isinstance(df['team1'].iloc[0], str):
        # Old format: convert date if needed
        if 'date' not in df.columns and 'match_date' in df.columns:
            df.rename(columns={'match_date': 'date'}, inplace=True)
        if 'winner' not in df.columns and 'match_winner' in df.columns:
            df.rename(columns={'match_winner': 'winner'}, inplace=True)
        # Convert date to datetime
        df['date_obj'] = pd.to_datetime(df['date'], errors='coerce')
        # Convert season to integer if exists
        if 'season' in df.columns:
            df['season'] = pd.to_numeric(df['season'], errors='coerce')
        return df
    
    # New format (numeric team IDs)
    # Load team mapping
    team_map_path = 'data/teams.csv'
    if not os.path.exists(team_map_path):
        print("❌ teams.csv not found. Please create it with columns: team_id,team_name")
        return None
    teams_df = pd.read_csv(team_map_path)
    team_dict = dict(zip(teams_df['team_id'], teams_df['team_name']))
    
    # Rename columns to match old expectations
    df.rename(columns={'match_date': 'date', 'match_winner': 'winner'}, inplace=True)
    
    # Convert numeric team IDs to names
    df['team1'] = df['team1'].map(team_dict)
    df['team2'] = df['team2'].map(team_dict)
    df['winner'] = df['winner'].map(team_dict)
    
    # Drop rows where mapping failed (unknown team ID)
    df = df.dropna(subset=['team1', 'team2', 'winner'])
    
    # Convert date to datetime
    df['date_obj'] = pd.to_datetime(df['date'], errors='coerce')
    # Convert season to integer if present
    if 'season' in df.columns:
        df['season'] = pd.to_numeric(df['season'], errors='coerce')
    
    return df

# ---------- AUTH ----------
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'error': 'Missing fields'}), 400
    conn = get_db()
    existing = conn.execute('SELECT id FROM users WHERE username = ?', (username,)).fetchone()
    if existing:
        return jsonify({'error': 'User already exists'}), 409
    hashed = bcrypt.generate_password_hash(password).decode('utf-8')
    conn.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, hashed))
    conn.commit()
    conn.close()
    return jsonify({'message': 'User created'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    conn = get_db()
    user = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
    conn.close()
    if not user or not bcrypt.check_password_hash(user['password'], password):
        return jsonify({'error': 'Invalid credentials'}), 401
    access_token = create_access_token(identity=user['id'])
    return jsonify({'token': access_token, 'username': username}), 200

# ---------- PREDICTION ----------
@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.json
    team_a = data.get('team_a')
    team_b = data.get('team_b')
    match_date = data.get('match_date', '')
    
    df = load_past_matches()
    if df is None:
        winner = team_a if team_a < team_b else team_b
        reason = f"Historical data not available. Based on team standings, {winner} is favored."
        return jsonify({'winner': winner, 'reason': reason})
    
    # 1. Head‑to‑head (last 5 matches) – use date_obj for sorting
    h2h = df[((df['team1'] == team_a) & (df['team2'] == team_b)) |
             ((df['team1'] == team_b) & (df['team2'] == team_a))]
    h2h_recent = h2h.sort_values('date_obj', ascending=False).head(5)
    team_a_h2h_wins = len(h2h_recent[h2h_recent['winner'] == team_a])
    team_b_h2h_wins = len(h2h_recent[h2h_recent['winner'] == team_b])
    
    # 2. Recent form (last 5 matches of each team)
    def get_recent_form(team, df, n=5):
        team_matches = df[(df['team1'] == team) | (df['team2'] == team)]
        team_matches = team_matches.sort_values('date_obj', ascending=False).head(n)
        wins = len(team_matches[team_matches['winner'] == team])
        total = len(team_matches)
        return wins, total
    
    form_a_wins, form_a_total = get_recent_form(team_a, df)
    form_b_wins, form_b_total = get_recent_form(team_b, df)
    form_a_pct = (form_a_wins / form_a_total * 100) if form_a_total > 0 else 0
    form_b_pct = (form_b_wins / form_b_total * 100) if form_b_total > 0 else 0
    
    # 3. Overall win percentage (for tiebreaker)
    def overall_win_pct(team, df):
        played = df[(df['team1'] == team) | (df['team2'] == team)]
        wins = len(played[played['winner'] == team])
        total = len(played)
        return (wins / total * 100) if total > 0 else 0
    
    overall_a = overall_win_pct(team_a, df)
    overall_b = overall_win_pct(team_b, df)
    
    # Decision logic (no random)
    if team_a_h2h_wins + team_b_h2h_wins >= 3:
        if team_a_h2h_wins > team_b_h2h_wins:
            winner = team_a
            reason = f"In the last 5 meetings, {team_a} won {team_a_h2h_wins} times against {team_b} (lost {team_b_h2h_wins})."
        elif team_b_h2h_wins > team_a_h2h_wins:
            winner = team_b
            reason = f"In the last 5 meetings, {team_b} won {team_b_h2h_wins} times against {team_a} (lost {team_a_h2h_wins})."
        else:
            if form_a_pct > form_b_pct:
                winner = team_a
                reason = f"Head‑to‑head is tied, but {team_a} has better recent form ({form_a_wins} wins in last {form_a_total} matches)."
            elif form_b_pct > form_a_pct:
                winner = team_b
                reason = f"Head‑to‑head is tied, but {team_b} has better recent form ({form_b_wins} wins in last {form_b_total} matches)."
            else:
                if overall_a > overall_b:
                    winner = team_a
                    reason = f"Both teams are evenly matched recently, but {team_a} has a stronger overall record ({overall_a:.1f}% wins)."
                elif overall_b > overall_a:
                    winner = team_b
                    reason = f"Both teams are evenly matched recently, but {team_b} has a stronger overall record ({overall_b:.1f}% wins)."
                else:
                    winner = team_a if team_a < team_b else team_b
                    reason = f"Both teams have identical records. Statistical edge goes to {winner}."
    else:
        if form_a_pct > form_b_pct:
            winner = team_a
            reason = f"{team_a} has won {form_a_wins} of their last {form_a_total} matches, while {team_b} has won {form_b_wins} of their last {form_b_total}."
        elif form_b_pct > form_a_pct:
            winner = team_b
            reason = f"{team_b} has won {form_b_wins} of their last {form_b_total} matches, while {team_a} has won {form_a_wins} of their last {form_a_total}."
        else:
            if overall_a > overall_b:
                winner = team_a
                reason = f"Recent form is similar, but {team_a} has a superior historical win percentage ({overall_a:.1f}%)."
            elif overall_b > overall_a:
                winner = team_b
                reason = f"Recent form is similar, but {team_b} has a superior historical win percentage ({overall_b:.1f}%)."
            else:
                winner = team_a if team_a < team_b else team_b
                reason = f"All metrics are equal. Historical precedence favors {winner}."
    
    # Save prediction
    try:
        conn = get_db()
        user = conn.execute('SELECT id FROM users LIMIT 1').fetchone()
        user_id = user['id'] if user else 1
        conn.execute('''INSERT INTO predictions (user_id, team_a, team_b, predicted_winner, prediction_date, match_date)
                        VALUES (?, ?, ?, ?, ?, ?)''',
                     (user_id, team_a, team_b, winner, datetime.now().isoformat(), match_date))
        conn.commit()
        conn.close()
    except Exception as e:
        print("Skipping save prediction:", e)
    
    return jsonify({'winner': winner, 'reason': reason})

@app.route('/api/my_predictions', methods=['GET'])
def my_predictions():
    try:
        conn = get_db()
        rows = conn.execute('SELECT team_a, team_b, predicted_winner, prediction_date, match_date FROM predictions ORDER BY prediction_date DESC').fetchall()
        conn.close()
        return jsonify([dict(row) for row in rows])
    except:
        return jsonify([])

# ---------- FIXTURES & STATS ----------
@app.route('/api/fixtures', methods=['GET'])
def get_fixtures():
    csv_path = 'data/upcoming_matches.csv'
    try:
        if not os.path.exists(csv_path):
            return jsonify([{"match_id": 1, "team_a": "India", "team_b": "Australia", "match_date": "22-03-2026", "venue": "MCG", "match_type": "ODI", "tournament": "Demo"}])
        df = pd.read_csv(csv_path, encoding='utf-8-sig')
        df.columns = df.columns.str.strip()
        required = ['match_id', 'team_a', 'team_b', 'match_date', 'venue', 'match_type', 'tournament']
        missing = [col for col in required if col not in df.columns]
        if missing:
            return jsonify({"error": f"CSV missing columns: {missing}"}), 500
        fixtures = df.to_dict(orient='records')
        return jsonify(fixtures)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/team_stats', methods=['GET'])
def team_stats():
    df = load_past_matches()
    if df is None:
        return jsonify({"top_teams": {"India": 5}})
    wins = df['winner'].value_counts().head(5).to_dict()
    return jsonify({"top_teams": wins})

@app.route('/api/team_detail', methods=['GET'])
def team_detail():
    team_name = request.args.get('name')
    from_year = request.args.get('from_year', type=int)
    to_year = request.args.get('to_year', type=int)
    
    if not team_name:
        return jsonify({'error': 'Team name required'}), 400
    
    df = load_past_matches()
    if df is None:
        return jsonify({'error': 'No data file'}), 404
    
    # Apply year filter if provided
    if from_year is not None and to_year is not None:
        if 'season' in df.columns:
            # Ensure season is numeric
            df['season'] = pd.to_numeric(df['season'], errors='coerce')
            df = df[(df['season'] >= from_year) & (df['season'] <= to_year)]
        elif 'date_obj' in df.columns:
            df = df[(df['date_obj'].dt.year >= from_year) & (df['date_obj'].dt.year <= to_year)]
    
    played = df[(df['team1'] == team_name) | (df['team2'] == team_name)]
    total = len(played)
    if total == 0:
        return jsonify({'team': team_name, 'total': 0, 'wins': 0, 'losses': 0, 'ties': 0, 'no_result': 0, 'win_percentage': 0, 'last5': [], 'filter_years': f"{from_year}-{to_year}" if from_year else 'All'})
    
    wins = len(played[played['winner'] == team_name])
    ties = 0
    no_result = 0
    losses = total - wins - ties - no_result
    win_percentage = (wins / total * 100) if total > 0 else 0
    
    # Use date_obj for sorting
    played_sorted = played.sort_values('date_obj', ascending=False)
    last5 = []
    for _, row in played_sorted.head(5).iterrows():
        opponent = row['team2'] if row['team1'] == team_name else row['team1']
        result = 'W' if row['winner'] == team_name else 'L'
        last5.append({'opponent': opponent, 'result': result, 'date': row['date'] if 'date' in row else row.get('match_date', '')})
    
    year_range_text = f"{from_year} to {to_year}" if from_year and to_year else "All seasons"
    
    return jsonify({
        'team': team_name,
        'total': total,
        'wins': wins,
        'losses': losses,
        'ties': ties,
        'no_result': no_result,
        'win_percentage': round(win_percentage, 1),
        'last5': last5,
        'filter_years': year_range_text
    })

@app.route('/api/h2h', methods=['GET'])
def head_to_head_detailed():
    teamA = request.args.get('teamA')
    teamB = request.args.get('teamB')
    from_year = request.args.get('from_year', type=int)
    to_year = request.args.get('to_year', type=int)
    
    if not teamA or not teamB:
        return jsonify({'error': 'Both teams required'}), 400
    
    df = load_past_matches()
    if df is None:
        return jsonify({'error': 'No data file'}), 404
    
    # Make a copy to avoid modifying the cached df
    df_filtered = df.copy()
    
    # Apply year filter if provided
    if from_year is not None and to_year is not None:
        if 'season' in df_filtered.columns:
            df_filtered['season'] = pd.to_numeric(df_filtered['season'], errors='coerce')
            df_filtered = df_filtered[(df_filtered['season'] >= from_year) & (df_filtered['season'] <= to_year)]
        elif 'date_obj' in df_filtered.columns:
            df_filtered = df_filtered[(df_filtered['date_obj'].dt.year >= from_year) & (df_filtered['date_obj'].dt.year <= to_year)]
    
    # Filter matches between the two selected teams
    matches = df_filtered[((df_filtered['team1'] == teamA) & (df_filtered['team2'] == teamB)) |
                          ((df_filtered['team1'] == teamB) & (df_filtered['team2'] == teamA))]
    total = len(matches)
    
    if total == 0:
        return jsonify({'teamA': teamA, 'teamB': teamB, 'total': 0, 'teamA_wins': 0, 'teamB_wins': 0, 'ties': 0, 'last5': []})
    
    teamA_wins = len(matches[matches['winner'] == teamA])
    teamB_wins = len(matches[matches['winner'] == teamB])
    ties = 0  # IPL data does not usually have ties, but you can adjust if needed
    
    # Most recent 5 encounters
    matches_sorted = matches.sort_values('date_obj', ascending=False)
    last5 = []
    for _, row in matches_sorted.head(5).iterrows():
        winner = row['winner']
        result = f"{teamA} won" if winner == teamA else (f"{teamB} won" if winner == teamB else "Tie/NR")
        last5.append({'date': row['date'], 'winner': result})
    
    return jsonify({
        'teamA': teamA,
        'teamB': teamB,
        'total': total,
        'teamA_wins': teamA_wins,
        'teamB_wins': teamB_wins,
        'ties': ties,
        'last5': last5
    })
@app.route('/api/seasons', methods=['GET'])
def get_seasons():
    df = load_past_matches()
    if df is None:
        return jsonify({'min_year': 2008, 'max_year': 2025, 'years': list(range(2008, 2026))})
    # Try to get years from season column or date_obj
    if 'season' in df.columns:
        # Convert to numeric, drop NaN
        years = pd.to_numeric(df['season'], errors='coerce').dropna().unique()
        years = sorted(years)
    elif 'date_obj' in df.columns:
        years = sorted(df['date_obj'].dt.year.dropna().unique())
    else:
        years = [2008, 2025]
    # Ensure min and max are integers
    min_year = int(min(years))
    max_year = int(max(years))
    return jsonify({'min_year': min_year, 'max_year': max_year, 'years': list(range(min_year, max_year+1))})

if __name__ == '__main__':
    app.run(debug=True, port=5000)