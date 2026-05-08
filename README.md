# 🏏 Cricket Match Winner Prediction System
------------------------------------------------------------------------


A full‑stack web application that predicts IPL match winners using machine learning (Random Forest) and historical IPL data (2008‑2025). Users can browse upcoming matches, make predictions, save their history, and explore detailed team statistics with year‑range filters.
------------------------------------------------------------------------


## ✨ Features
------------------------------------------------------------------------


- **IPL Match Calendar** – View projected 2026 fixtures (based on real 2025 data).  
- **Smart Predictions** – Click any match, the system analyses head‑to‑head, recent form, and overall win percentage to give a clear reason for the winner.  
- **Prediction History** – Every prediction is saved to a SQLite database and shown in a table.  
- **Team Statistics**  
  - Team Performance: select a team and a year range (e.g., 2021‑2025) → see matches played, wins, losses, win percentage, and last 5 results.  
  - Head‑to‑Head: compare two teams over any season range → total matches, wins each, last 5 encounters.  
- **User Authentication** – Signup / login with JWT (optional – currently bypassed for demo).  
- **Modern UI** – Built with React + Tailwind CSS (dark mode, responsive, professional design).
------------------------------------------------------------------------


## 🛠️ Tech Stack

| Layer       | Technologies                                 |
|-------------|----------------------------------------------|
| Frontend    | React, Tailwind CSS, Axios, React Router    |
| Backend     | Python, Flask, Flask‑CORS, Flask‑JWT‑Extended, Flask‑BCrypt |
| Database    | SQLite (user accounts, prediction history)  |
| Data        | Pandas, NumPy – CSV files (IPL 2008‑2025)   |
| ML Model    | Random Forest (Scikit‑learn)                |

All data is stored locally in CSV files – no external API required.
------------------------------------------------------------------------


## 📂 Project Structure
------------------------------------------------------------------------


Cricket/
├── backend/
│ ├── app.py # Flask main entry point
│ ├── load_data.py # (optional) helper for data preprocessing
│ ├── requirements.txt # Python dependencies
│ ├── data/
│ │ ├── past_matches.csv # IPL 2008‑2025 match data
│ │ ├── upcoming_matches.csv # IPL 2026 schedule
│ │ └── teams.csv # Mapping team IDs → names
│ ├── database/
│ │ └── cricket.db # SQLite DB (created automatically)
│ └── model/
│ └── prediction_model.pkl # trained Random Forest model
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/ # Navbar, Sidebar, etc.
│ │ ├── pages/ # Landing, Dashboard, PredictWinner, MatchCalendar, MyPredictions, TeamStats
│ │ ├── api.js # Axios configuration and API calls
│ │ ├── App.jsx # Routing
│ │ └── main.jsx
│ ├── package.json
│ └── vite.config.js
├── .gitignore
├── README.md
└── requirements.txt

------------------------------------------------------------------------

## 🚀 Getting Started

------------------------------------------------------------------------


### Prerequisites

- Python 3.10+ (with pip)
- Node.js 18+ (with npm)
------------------------------------------------------------------------


### Backend Setup
------------------------------------------------------------------------


1. **Navigate to the backend folder**:
   ```bash
   cd backend
Create and activate a virtual environment (optional but recommended):
------------------------------------------------------------------------

python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
Install dependencies:
------------------------------------------------------------------------

pip install -r requirements.txt
Place your data files in backend/data/:

past_matches.csv (IPL 2008‑2025)

upcoming_matches.csv (IPL 2026 schedule)

teams.csv (team ID mapping, if using numeric IDs)

Run the Flask server:
------------------------------------------------------------------------

bash
python app.py
The backend will run on http://localhost:5000.

Frontend Setup
Open a new terminal and go to the frontend folder:
------------------------------------------------------------------------


cd frontend
Install Node dependencies:

npm install
Start the development server:

npm run dev
The frontend will be available at http://localhost:5173.
------------------------------------------------------------------------

Using the Application
Sign up for a new account (or use the demo – no verification needed).

Browse the Match Calendar and click Predict Now on any IPL 2026 match.

The Predict Winner page shows the match details → click Predict Winner to get a data‑driven prediction with explanation.

Explore Team Statistics – select teams and year ranges to see performance breakdowns.

Check your prediction history in the My Predictions page.

📊 Data Sources
Past matches: IPL dataset from 2008 to 2025 (obtained from Kaggle – slidescope/ipl-seasons-2008-to-2025-dataset).

Upcoming matches: IPL 2025 schedule converted to 2026, cleaned and quoted for CSV parsing.

All data is preprocessed to use consistent column names (team1, team2, winner, date, season).

📝 License
This project is created for educational purposes as a BCA final year project. All data is used for academic demonstration.

🙏 Acknowledgements
Kaggle for IPL datasets

Cricsheet for ball‑by‑ball data inspiration

React, Flask, and Tailwind CSS communities

Made with ❤️
---

