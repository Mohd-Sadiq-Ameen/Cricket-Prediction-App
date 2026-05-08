import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import {
  BarChart3,
  CalendarDays,
  Trophy,
  Database,
  ShieldCheck,
  BrainCircuit,
  ArrowRight,
  Sun,
  Moon,
} from 'lucide-react';

export default function Landing() {
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

  return (
    <div className="min-h-screen overflow-hidden transition-colors duration-300 bg-slate-100 dark:bg-[#0b1120] text-slate-900 dark:text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.12),transparent_35%)] pointer-events-none" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_30%)] dark:bg-[radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_30%)] pointer-events-none" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#0b1120]/80">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-2xl">🏏</span>
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight">
                Cric<span className="text-amber-400">Predict</span>
              </h1>

              <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1">
                IPL Analytics Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 transition flex items-center justify-center"
            >
              {darkMode ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>

            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-semibold hover:bg-amber-300 transition shadow-lg shadow-amber-500/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 border border-amber-400/20 bg-amber-400/10 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm mb-8">
              <BrainCircuit size={16} />
              Machine Learning Powered IPL Predictions
            </div>

            <h2 className="text-5xl md:text-6xl font-black leading-[1.1] tracking-tight">
              Predict IPL Match Winners Using
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-500 mt-3">
                Real Match Data
              </span>
            </h2>

            <p className="text-slate-600 dark:text-slate-400 text-lg leading-8 mt-8 max-w-2xl">
              A full-stack cricket analytics platform that combines React,
              Flask, SQLite, and Machine Learning to predict IPL match outcomes
              using historical data from 2008–2025.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                to="/signup"
                className="group inline-flex items-center gap-2 bg-amber-400 text-slate-950 px-7 py-4 rounded-2xl font-bold hover:bg-amber-300 transition shadow-xl shadow-amber-500/20"
              >
                Start Predicting

                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition"
                />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 px-7 py-4 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              >
                Explore Dashboard
              </Link>
            </div>

            {/* Mini Stats */}
            <div className="grid grid-cols-3 gap-6 mt-14">
              <div>
                <h3 className="text-3xl font-black text-amber-500">18</h3>

                <p className="text-sm text-slate-500 mt-1">
                  IPL Seasons
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-black text-amber-500">
                  1200+
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Matches Analysed
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-black text-amber-500">
                  ML + Stats
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Prediction Engine
                </p>
              </div>
            </div>
          </div>

          {/* Right UI Mock */}
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-amber-500/10 blur-3xl rounded-full" />

            <div className="relative bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
              {/* Top bar */}
              <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>

              <div className="p-8 space-y-6">
                {/* Match card */}
                <div className="bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">
                        Upcoming Match
                      </p>

                      <h3 className="text-2xl font-bold mt-2">
                        CSK vs MI
                      </h3>
                    </div>

                    <div className="bg-amber-400/10 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-xl text-sm border border-amber-400/20">
                      IPL 2026
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <div className="bg-white dark:bg-slate-800/80 rounded-xl p-4 text-center">
                      <p className="text-slate-500 text-sm">
                        CSK Form
                      </p>

                      <h4 className="text-2xl font-black mt-2 text-green-500">
                        4W
                      </h4>
                    </div>

                    <div className="bg-white dark:bg-slate-800/80 rounded-xl p-4 text-center">
                      <p className="text-slate-500 text-sm">
                        MI Form
                      </p>

                      <h4 className="text-2xl font-black mt-2 text-yellow-500">
                        2W
                      </h4>
                    </div>

                    <div className="bg-white dark:bg-slate-800/80 rounded-xl p-4 text-center">
                      <p className="text-slate-500 text-sm">
                        Prediction
                      </p>

                      <h4 className="text-2xl font-black mt-2 text-amber-500">
                        CSK
                      </h4>
                    </div>
                  </div>

                  <button className="w-full mt-8 bg-amber-400 text-slate-950 py-3 rounded-xl font-bold hover:bg-amber-300 transition">
                    Predict Winner
                  </button>
                </div>

                {/* Analytics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="text-amber-500" size={20} />

                      <h4 className="font-semibold">
                        Win Percentage
                      </h4>
                    </div>

                    <div className="mt-5">
                      <div className="w-full h-3 bg-slate-300 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="w-[74%] h-full bg-gradient-to-r from-amber-300 to-orange-500 rounded-full" />
                      </div>

                      <p className="text-sm text-slate-500 mt-3">
                        CSK – 74% success rate
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center gap-3">
                      <CalendarDays
                        className="text-blue-500"
                        size={20}
                      />

                      <h4 className="font-semibold">
                        Fixtures
                      </h4>
                    </div>

                    <div className="space-y-3 mt-5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          RCB vs KKR
                        </span>

                        <span>May 12</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          MI vs GT
                        </span>

                        <span>May 14</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          CSK vs RR
                        </span>

                        <span>May 16</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-amber-500 font-semibold tracking-wider uppercase text-sm">
            Core Features
          </p>

          <h3 className="text-4xl font-black mt-4">
            Built as a Complete Full-Stack ML Project
          </h3>

          <p className="text-slate-600 dark:text-slate-400 mt-6 leading-8">
            The platform combines sports analytics, machine learning, and modern
            web engineering into a single interactive dashboard.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-16">
          {[
            {
              icon: Trophy,
              title: 'Winner Prediction',
              desc: 'Predict IPL match outcomes using Random Forest models trained on historical data.',
            },
            {
              icon: CalendarDays,
              title: 'IPL Match Calendar',
              desc: 'Browse upcoming IPL fixtures and instantly predict any match.',
            },
            {
              icon: BarChart3,
              title: 'Team Analytics',
              desc: 'Visualize win rates, recent form, losses, and head-to-head statistics.',
            },
            {
              icon: Database,
              title: 'Prediction History',
              desc: 'Store and track user predictions using SQLite database integration.',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl p-7 hover:border-amber-400/40 transition duration-300 shadow-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-amber-400/5 to-transparent opacity-0 group-hover:opacity-100 transition" />

              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mb-6">
                  <feature.icon
                    className="text-amber-500"
                    size={26}
                  />
                </div>

                <h4 className="text-xl font-bold mb-3">
                  {feature.title}
                </h4>

                <p className="text-slate-600 dark:text-slate-400 leading-7 text-sm">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="border-y border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <p className="text-amber-500 uppercase tracking-wider text-sm font-semibold">
              Architecture
            </p>

            <h3 className="text-4xl font-black mt-4">
              Modern Development Stack
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              {
                title: 'Frontend',
                tech: [
                  'React.js',
                  'Tailwind CSS',
                  'Axios',
                  'React Router',
                ],
              },
              {
                title: 'Backend',
                tech: [
                  'Flask',
                  'Flask JWT',
                  'REST APIs',
                  'SQLite',
                ],
              },
              {
                title: 'Machine Learning',
                tech: [
                  'Random Forest',
                  'Pandas',
                  'NumPy',
                  'scikit-learn',
                ],
              },
            ].map((stack, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm"
              >
                <h4 className="text-xl font-bold mb-6">
                  {stack.title}
                </h4>

                <div className="space-y-4 text-slate-700 dark:text-slate-300">
                  {stack.tech.map((item, i) => (
                    <div key={i}>• {item}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h4 className="text-xl font-black">
              Cric<span className="text-amber-400">Predict</span>
            </h4>

            <p className="text-slate-500 text-sm mt-2">
              IPL Match Winner Prediction using Machine Learning
            </p>
          </div>

          <div className="flex items-center gap-8 text-slate-500 text-sm">
            <Link
              to="/login"
              className="hover:text-amber-500 transition"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="hover:text-amber-500 transition"
            >
              Sign Up
            </Link>

            <div className="flex items-center gap-2">
              <ShieldCheck size={16} />
              Academic Project
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}