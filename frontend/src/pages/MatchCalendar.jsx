import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFixtures } from '../api';

export default function MatchCalendar() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    getFixtures()
      .then((res) => {
        setMatches(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load fixtures', err);
        setLoading(false);
      });
  }, []);

  const handlePredictNow = (match) => {
    navigate('/dashboard/predict', {
      state: { selectedMatch: match },
    });
  };

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h2 className="text-4xl font-black text-slate-900 dark:text-white">
          IPL Match Calendar
        </h2>

        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Browse upcoming IPL 2026 fixtures and predict winners instantly.
        </p>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center text-slate-500 dark:text-slate-400 shadow-sm">
          Loading matches...
        </div>
      ) : (
        <div className="grid gap-6">
          {matches.map((m) => (
            <div
              key={m.match_id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400/40 rounded-3xl p-7 transition-all duration-300 shadow-sm"
            >
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
                {/* Match Info */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-amber-100 dark:bg-amber-400/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-400/20 px-3 py-1 rounded-full text-xs font-bold">
                      {m.tournament}
                    </span>

                    <span className="text-slate-500 text-sm">
                      {m.match_type}
                    </span>
                  </div>

                  <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                    {m.team_a}
                    <span className="mx-3 text-slate-400">vs</span>
                    {m.team_b}
                  </h3>

                  <div className="mt-5 space-y-2">
                    <p className="text-slate-700 dark:text-slate-300">
                      📅 {m.match_date}
                    </p>

                    <p className="text-slate-500 text-sm">
                      🏟️ {m.venue}
                    </p>
                  </div>
                </div>

                {/* Button */}
                <button
                  onClick={() => handlePredictNow(m)}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-7 py-4 rounded-2xl transition shadow-lg shadow-amber-500/20"
                >
                  Predict Now →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}