// Login.jsx

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api';
import { ArrowRight, Sun, Moon } from 'lucide-react';

export default function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Theme
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

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await login({ username, password });

      localStorage.setItem('token', res.data.token);

      if (setIsAuthenticated) {
        setIsAuthenticated(true);
      }

      navigate('/dashboard');
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0b1120] flex items-center justify-center px-6 relative overflow-hidden transition-colors duration-300">
      {/* Theme Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-6 right-6 z-50 w-12 h-12 rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 flex items-center justify-center text-slate-700 dark:text-white hover:scale-105 transition"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Background Glow */}
      <div className="absolute top-[-150px] left-[-100px] w-[400px] h-[400px] bg-amber-500/10 blur-3xl rounded-full" />
      <div className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] bg-blue-500/10 blur-3xl rounded-full" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-2xl shadow-amber-500/20 mb-6">
            <span className="text-4xl">🏏</span>
          </div>

          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Cric<span className="text-amber-400">Predict</span>
          </h1>

          <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm">
            IPL Match Winner Prediction System
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-white/[0.04] backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl transition">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              Welcome Back
            </h2>

            <p className="text-slate-600 dark:text-slate-400 mt-3">
              Login to continue to your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">
                Username
              </label>

              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 outline-none rounded-2xl px-5 py-4 text-slate-900 dark:text-white placeholder:text-slate-500 transition"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 outline-none rounded-2xl px-5 py-4 text-slate-900 dark:text-white placeholder:text-slate-500 transition"
                required
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20"
            >
              {loading ? 'Signing In...' : 'Login'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Bottom */}
          <div className="mt-8 text-center text-slate-600 dark:text-slate-400 text-sm">
            Don&apos;t have an account?{' '}
            <Link
              to="/signup"
              className="text-amber-500 hover:text-amber-400 font-semibold transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}