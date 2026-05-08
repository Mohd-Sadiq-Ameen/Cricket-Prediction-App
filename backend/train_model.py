import pandas as pd
import os
from sklearn.ensemble import RandomForestClassifier
import joblib

# Ensure data folder exists
os.makedirs('data', exist_ok=True)
csv_path = 'data/past_matches.csv'

# If file is missing or empty, create sample data
if not os.path.exists(csv_path) or os.path.getsize(csv_path) == 0:
    print("⚠️ past_matches.csv not found or empty. Creating sample data...")
    sample_data = pd.DataFrame({
        'team1': ['India', 'Australia', 'England', 'India', 'Pakistan', 'New Zealand'],
        'team2': ['Australia', 'England', 'India', 'Pakistan', 'India', 'England'],
        'winner': ['India', 'Australia', 'India', 'India', 'Pakistan', 'New Zealand'],
        'date': ['2024-01-01', '2024-01-05', '2024-01-10', '2024-01-15', '2024-01-20', '2024-01-25']
    })
    sample_data.to_csv(csv_path, index=False)
    print(f"✅ Sample data written to {csv_path}")
    df = sample_data
else:
    df = pd.read_csv(csv_path)

# Feature engineering
df['team1_code'] = df['team1'].astype('category').cat.codes
df['team2_code'] = df['team2'].astype('category').cat.codes
X = df[['team1_code', 'team2_code']]
y = (df['winner'] == df['team1']).astype(int)

# Train model
model = RandomForestClassifier(n_estimators=100)
model.fit(X, y)

os.makedirs('model', exist_ok=True)
joblib.dump(model, 'model/prediction_model.pkl')
print("✅ Model saved to model/prediction_model.pkl")