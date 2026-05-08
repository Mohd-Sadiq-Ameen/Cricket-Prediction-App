import { useEffect, useState } from "react";
import { getMyPredictions } from "../api";

// Helper to convert YYYY-MM-DD to DD-MM-YYYY
function formatDate(isoDate) {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export default function MyPredictions() {
  const [list, setList] = useState([]);
  useEffect(() => {
    getMyPredictions().then((res) => setList(res.data));
  }, []);
  // MyPredictions.jsx UI ONLY

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-black text-slate-900 dark:text-white">
          My Predictions
        </h2>

        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Track all previously predicted IPL matches.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800">
              <tr className="text-slate-500 text-sm uppercase tracking-wider">
                <th className="px-6 py-5">Team A</th>
                <th className="px-6 py-5">Team B</th>
                <th className="px-6 py-5">Predicted Winner</th>
                <th className="px-6 py-5">Date</th>
              </tr>
            </thead>

            <tbody>
              {list.map((p, i) => (
                <tr
                  key={i}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition"
                >
                  <td className="px-6 py-5 font-semibold text-slate-900 dark:text-white">
                    {p.team_a}
                  </td>

                  <td className="px-6 py-5 text-slate-600 dark:text-slate-300">
                    {p.team_b}
                  </td>

                  <td className="px-6 py-5">
                    <span className="bg-green-100 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-semibold">
                      {p.predicted_winner}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-slate-500">
                    {formatDate(p.prediction_date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
