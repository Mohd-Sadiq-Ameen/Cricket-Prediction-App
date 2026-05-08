import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export default function TeamStats() {
  const [activeTab, setActiveTab] = useState("team");
  const [teamsList, setTeamsList] = useState([]);

  // Team Performance state
  const [selectedTeam, setSelectedTeam] = useState("");
  const [teamStats, setTeamStats] = useState(null);
  const [loadingTeam, setLoadingTeam] = useState(false);

  // Year range state
  const [minYear, setMinYear] = useState(2008);
  const [maxYear, setMaxYear] = useState(2025);
  const [fromYear, setFromYear] = useState(2008);
  const [toYear, setToYear] = useState(2025);

  // Head-to-head state
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [h2hStats, setH2hStats] = useState(null);
  const [loadingH2h, setLoadingH2h] = useState(false);

  // Fetch list of teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get(`${API_BASE}/fixtures`);
        const teamsFromFixtures = new Set();
        res.data.forEach((m) => {
          teamsFromFixtures.add(m.team_a);
          teamsFromFixtures.add(m.team_b);
        });
        if (teamsFromFixtures.size > 0) {
          setTeamsList(Array.from(teamsFromFixtures).sort());
        } else {
          setTeamsList([
            "CSK", "MI", "RCB", "KKR", "SRH", "RR", "DC", "GT", "LSG", "PBKS"
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch teams", err);
        setTeamsList([
          "CSK", "MI", "RCB", "KKR", "SRH", "RR", "DC", "GT", "LSG", "PBKS"
        ]);
      }
    };
    fetchTeams();
  }, []);

  // Fetch available seasons range
  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const res = await axios.get(`${API_BASE}/seasons`);
        setMinYear(res.data.min_year);
        setMaxYear(res.data.max_year);
        setFromYear(res.data.min_year);
        setToYear(res.data.max_year);
      } catch (err) {
        console.error("Failed to fetch seasons", err);
      }
    };
    fetchSeasons();
  }, []);

  // Load team stats when selectedTeam or year range changes
  useEffect(() => {
    if (!selectedTeam) return;
    const fetchTeamStats = async () => {
      setLoadingTeam(true);
      try {
        const res = await axios.get(`${API_BASE}/team_detail`, {
          params: { name: selectedTeam, from_year: fromYear, to_year: toYear },
        });
        setTeamStats(res.data);
      } catch (err) {
        console.error(err);
        setTeamStats(null);
      } finally {
        setLoadingTeam(false);
      }
    };
    fetchTeamStats();
  }, [selectedTeam, fromYear, toYear]);

  // Load head-to-head stats when both teams selected
  useEffect(() => {
    if (!teamA || !teamB) return;
    const fetchH2h = async () => {
      setLoadingH2h(true);
      try {
        const res = await axios.get(`${API_BASE}/h2h`, {
          params: { teamA, teamB, from_year: fromYear, to_year: toYear },
        });
        setH2hStats(res.data);
      } catch (err) {
        console.error(err);
        setH2hStats(null);
      } finally {
        setLoadingH2h(false);
      }
    };
    fetchH2h();
  }, [teamA, teamB, fromYear, toYear]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-black text-slate-900 dark:text-white">
          Team Statistics
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Analyze IPL team performance and head-to-head records.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
        {/* Year Filter */}
        <div className="flex flex-wrap items-center gap-5 mb-8">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
              From Season
            </p>
            <select
              value={fromYear}
              onChange={(e) => setFromYear(parseInt(e.target.value))}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-slate-900 dark:text-white"
            >
              {Array.from(
                { length: maxYear - minYear + 1 },
                (_, i) => minYear + i
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
              To Season
            </p>
            <select
              value={toYear}
              onChange={(e) => setToYear(parseInt(e.target.value))}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-slate-900 dark:text-white"
            >
              {Array.from(
                { length: maxYear - minYear + 1 },
                (_, i) => minYear + i
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-10">
          <button
            onClick={() => setActiveTab("team")}
            className={`px-6 py-3 rounded-2xl font-semibold transition ${
              activeTab === "team"
                ? "bg-amber-400 text-slate-950"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            Team Performance
          </button>
          <button
            onClick={() => setActiveTab("h2h")}
            className={`px-6 py-3 rounded-2xl font-semibold transition ${
              activeTab === "h2h"
                ? "bg-amber-400 text-slate-950"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            Head-to-Head
          </button>
        </div>

        {/* ========== TEAM PERFORMANCE TAB ========== */}
        {activeTab === "team" && (
          <div className="mt-4">
            {/* Team dropdown */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Select Team
              </label>
              <input
                type="text"
                list="teams"
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                placeholder="Type or select an IPL team..."
                className="w-full max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <datalist id="teams">
                {teamsList.map((team) => (
                  <option key={team} value={team} />
                ))}
              </datalist>
            </div>

            {/* Stats display */}
            {loadingTeam && (
              <div className="text-center py-8 text-slate-500">Loading team stats...</div>
            )}
            {!loadingTeam && selectedTeam && teamStats && teamStats.total === 0 && (
              <div className="text-center py-8 text-slate-500">
                No data for {selectedTeam} in the selected season range.
              </div>
            )}
            {!loadingTeam && selectedTeam && teamStats && teamStats.total > 0 && (
              <div className="space-y-6">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Data from {teamStats.filter_years}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                    <div className="text-sm text-slate-500">Matches</div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">
                      {teamStats.total}
                    </div>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl">
                    <div className="text-sm text-slate-500">Wins</div>
                    <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      {teamStats.wins}
                    </div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-2xl">
                    <div className="text-sm text-slate-500">Losses</div>
                    <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                      {teamStats.losses}
                    </div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-2xl">
                    <div className="text-sm text-slate-500">Win %</div>
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {teamStats.win_percentage}%
                    </div>
                  </div>
                </div>

                {/* Win percentage bar */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Win Percentage</span>
                    <span>{teamStats.win_percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                    <div
                      className="bg-amber-500 h-3 rounded-full"
                      style={{ width: `${teamStats.win_percentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Last 5 matches */}
                <div>
                  <p className="font-medium mb-3">Last 5 Matches</p>
                  <div className="flex flex-wrap gap-3">
                    {teamStats.last5.map((match, idx) => (
                      <span
                        key={idx}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          match.result === "W"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                        }`}
                      >
                        vs {match.opponent} ({match.result})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {!loadingTeam && !selectedTeam && (
              <div className="text-center py-8 text-slate-400">
                Select a team to view statistics.
              </div>
            )}
          </div>
        )}

        {/* ========== HEAD‑TO‑HEAD TAB ========== */}
        {activeTab === "h2h" && (
          <div className="mt-4">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Team A
                </label>
                <input
                  type="text"
                  list="teams"
                  value={teamA}
                  onChange={(e) => setTeamA(e.target.value)}
                  placeholder="Select first team"
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Team B
                </label>
                <input
                  type="text"
                  list="teams"
                  value={teamB}
                  onChange={(e) => setTeamB(e.target.value)}
                  placeholder="Select second team"
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            {loadingH2h && (
              <div className="text-center py-8 text-slate-500">
                Loading head‑to‑head...
              </div>
            )}
            {!loadingH2h && teamA && teamB && h2hStats && h2hStats.total === 0 && (
              <div className="text-center py-8 text-slate-500">
                No matches found between {teamA} and {teamB} in selected season range.
              </div>
            )}
            {!loadingH2h && teamA && teamB && h2hStats && h2hStats.total > 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                    <div className="text-sm text-slate-500">Total Matches</div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">
                      {h2hStats.total}
                    </div>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl">
                    <div className="text-sm text-slate-500">{teamA} Wins</div>
                    <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      {h2hStats.teamA_wins}
                    </div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-2xl">
                    <div className="text-sm text-slate-500">{teamB} Wins</div>
                    <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                      {h2hStats.teamB_wins}
                    </div>
                  </div>
                </div>

                {/* Last 5 encounters */}
                <div>
                  <p className="font-medium mb-3">Last 5 Encounters</p>
                  <ul className="divide-y divide-slate-200 dark:divide-slate-800 border rounded-2xl overflow-hidden">
                    {h2hStats.last5.map((enc, idx) => (
                      <li
                        key={idx}
                        className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50"
                      >
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          {enc.date}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {enc.winner}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {!loadingH2h && (!teamA || !teamB) && (
              <div className="text-center py-8 text-slate-400">
                Select two teams to compare.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}