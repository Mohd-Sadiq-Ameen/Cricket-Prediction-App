import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

import {
  Menu,
  Trophy,
  CalendarDays,
  History,
  BarChart3,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';

import PredictWinner from './PredictWinner';
import MatchCalendar from './MatchCalendar';
import MyPredictions from './MyPredictions';
import TeamStats from './TeamStats';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') !== 'light';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    {
      name: 'Predict Winner',
      icon: Trophy,
      path: '/dashboard/predict',
    },
    {
      name: 'Match Calendar',
      icon: CalendarDays,
      path: '/dashboard/calendar',
    },
    {
      name: 'My Predictions',
      icon: History,
      path: '/dashboard/history',
    },
    {
      name: 'Team Stats',
      icon: BarChart3,
      path: '/dashboard/stats',
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 dark:bg-[#0b1120] transition-colors duration-300">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-72' : 'w-24'
        } transition-all duration-300 border-r border-slate-200 dark:border-white/5 bg-white dark:bg-[#0f172a] flex flex-col`}
      >
        {/* Logo */}
        <div className="h-24 flex items-center px-6 border-b border-slate-200 dark:border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
              <span className="text-3xl">🏏</span>
            </div>

            {sidebarOpen && (
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                  Cric<span className="text-amber-500">Predict</span>
                </h1>

                <p className="text-xs text-slate-500">
                  IPL Analytics Dashboard
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-3">
          {navItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
                  active
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-lg'
                    : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
                }`}
              >
                <item.icon size={22} />

                {sidebarOpen && (
                  <span className="text-sm">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Buttons */}
        <div className="p-4 border-t border-slate-200 dark:border-white/5 space-y-3">
          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center justify-center gap-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 py-4 rounded-2xl transition text-slate-700 dark:text-white"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}

            {sidebarOpen && (
              <span>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 py-4 rounded-2xl transition"
          >
            <LogOut size={20} />

            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-24 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#0f172a]/70 backdrop-blur-xl px-8 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition flex items-center justify-center text-slate-700 dark:text-white"
            >
              <Menu size={22} />
            </button>

            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Dashboard
              </h2>

              <p className="text-slate-500 text-sm">
                IPL Match Prediction System
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/5 px-5 py-3 rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              R
            </div>

            <div>
              <p className="font-semibold text-sm text-slate-900 dark:text-white">
                Welcome Back
              </p>

              <p className="text-xs text-slate-500">
                CricPredict User
              </p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8 bg-slate-100 dark:bg-[#0b1120] transition-colors duration-300">
          <Routes>
            <Route path="predict" element={<PredictWinner />} />
            <Route path="calendar" element={<MatchCalendar />} />
            <Route path="history" element={<MyPredictions />} />
            <Route path="stats" element={<TeamStats />} />
            <Route path="*" element={<PredictWinner />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}