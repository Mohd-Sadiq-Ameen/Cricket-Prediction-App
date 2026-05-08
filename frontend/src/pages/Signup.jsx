// Signup.jsx

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../api';
import { ArrowRight, Sun, Moon } from 'lucide-react';

export default function Signup() {
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

      await signup({ username, password });

      alert('Account created successfully!');
      navigate('/login');
    } catch (err) {
      alert('Signup failed: ' + (err.response?.data?.error || err.message));
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
      <div className="absolute top-[-150px] right-[-100px] w-[400px] h-[400px] bg-blue-500/10 blur-3xl rounded-full" />
      <div className="absolute bottom-[-150px] left-[-100px] w-[400px] h-[400px] bg-amber-500/10 blur-3xl rounded-full" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-2xl shadow-blue-500/20 mb-6">
            <span className="text-4xl">🏏</span>
          </div>

          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Cric<span className="text-blue-500 dark:text-blue-400">Predict</span>
          </h1>

          <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm">
            Create your prediction account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-white/[0.04] backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl transition">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              Create Account
            </h2>

            <p className="text-slate-600 dark:text-slate-400 mt-3">
              Start exploring IPL analytics & predictions
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
                placeholder="Choose username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 outline-none rounded-2xl px-5 py-4 text-slate-900 dark:text-white placeholder:text-slate-500 transition"
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
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 outline-none rounded-2xl px-5 py-4 text-slate-900 dark:text-white placeholder:text-slate-500 transition"
                required
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-400 text-white py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Bottom */}
          <div className="mt-8 text-center text-slate-600 dark:text-slate-400 text-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-500 dark:text-blue-400 hover:text-blue-400 font-semibold transition"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}