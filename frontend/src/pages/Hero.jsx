import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-6 py-32 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left content */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-extrabold leading-tight"
          >
            Ship faster.
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Stay organized.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-slate-300 max-w-xl"
          >
            IssueFlow is a modern, developer-friendly issue tracker with Kanban
            workflows, real-time updates, and role-based access — built for teams
            who move fast.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex gap-4"
          >
            <Link
              to="/register"
              className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition text-lg font-semibold shadow-lg shadow-indigo-600/30"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 transition text-lg"
            >
              Sign In
            </Link>
          </motion.div>
        </div>

        {/* Right visual mock */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="hidden md:block"
        >
          <div className="bg-slate-900/80 backdrop-blur rounded-2xl border border-slate-800 p-6 shadow-2xl">
            <div className="flex gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {["Todo", "In Progress", "Done"].map((col) => (
                <div key={col} className="bg-slate-800 rounded-lg p-3">
                  <h4 className="text-sm font-semibold mb-2">{col}</h4>
                  <div className="h-16 rounded bg-slate-700/50" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
