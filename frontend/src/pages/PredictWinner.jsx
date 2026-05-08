import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { predict, getHeadToHead } from '../api';

export default function PredictWinner() {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedMatch, setSelectedMatch] = useState(null);
  const [headToHead, setHeadToHead] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.selectedMatch) {
      setSelectedMatch(location.state.selectedMatch);
      setPrediction(null);

      getHeadToHead(
        location.state.selectedMatch.team_a,
        location.state.selectedMatch.team_b
      )
        .then((res) => setHeadToHead(res.data))
        .catch((err) => console.error(err));
    } else {
      setSelectedMatch(null);
      setHeadToHead(null);
      setPrediction(null);
    }
  }, [location.state]);

  const handlePredict = async () => {
    if (!selectedMatch) return;

    setLoading(true);

    try {
      const res = await predict({
        team_a: selectedMatch.team_a,
        team_b: selectedMatch.team_b,
        match_date: selectedMatch.match_date,
      });

      setPrediction(res.data);
    } catch (err) {
      alert(
        'Prediction failed: ' +
          (err.response?.data?.error || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePredictAnother = () => {
    navigate('/dashboard/calendar');
  };

  const handleClearStartOver = () => {
    setSelectedMatch(null);
    setHeadToHead(null);
    setPrediction(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Heading */}
      <div>
        <h2 className="text-4xl font-black text-slate-900 dark:text-white">
          Predict Match Winner
        </h2>

        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Select an IPL fixture and generate AI-powered predictions.
        </p>
      </div>

      {!selectedMatch ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-14 text-center shadow-sm">
          <div className="text-6xl mb-6">🏏</div>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            No Match Selected
          </h3>

          <p className="text-slate-500 dark:text-slate-400 mt-3 mb-8">
            Go to the match calendar and select an IPL fixture to begin prediction.
          </p>

          <button
            onClick={() => navigate('/dashboard/calendar')}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-8 py-4 rounded-2xl font-bold transition"
          >
            Go to Match Calendar
          </button>
        </div>
      ) : (
        <>
          {/* Match Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-amber-100 dark:bg-amber-400/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-400/20 px-3 py-1 rounded-full text-xs font-semibold">
                    {selectedMatch.tournament}
                  </span>

                  <span className="text-slate-500 text-sm">
                    {selectedMatch.match_type}
                  </span>
                </div>

                <h3 className="text-4xl font-black text-slate-900 dark:text-white">
                  {selectedMatch.team_a}
                  <span className="text-slate-400 mx-3">vs</span>
                  {selectedMatch.team_b}
                </h3>

                <div className="mt-5 space-y-2 text-slate-600 dark:text-slate-400">
                  <p>📅 {selectedMatch.match_date}</p>
                  <p>🏟️ {selectedMatch.venue}</p>
                </div>
              </div>

              <button
                onClick={handlePredict}
                disabled={loading}
                className="bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-2xl transition disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Predict Winner'}
              </button>
            </div>
          </div>

          {/* Prediction */}
          {prediction && (
            <div className="bg-white dark:bg-slate-900 border border-green-200 dark:border-green-500/20 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 flex items-center justify-center text-3xl">
                  🏆
                </div>

                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Prediction Result
                  </p>

                  <h3 className="text-4xl font-black text-slate-900 dark:text-white">
                    {prediction.winner}
                  </h3>
                </div>
              </div>

              <p className="text-slate-700 dark:text-slate-300 text-lg leading-8">
                {prediction.reason}
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <button
                  onClick={handlePredictAnother}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-6 py-3 rounded-2xl font-bold transition"
                >
                  Predict Another Match
                </button>

                <button
                  onClick={handleClearStartOver}
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-2xl transition"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}