import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const projects = [
  { id: 1, name: "IssueFlow Core", issues: 12 },
  { id: 2, name: "Frontend Revamp", issues: 7 },
  { id: 3, name: "API Gateway", issues: 3 },
];

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold">Your Projects</h1>
          <p className="text-slate-400 mt-1">
            Track progress, manage issues, ship faster.
          </p>
        </div>

        <Link
          to="/create-project"
          className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-600/30 transition"
        >
          + New Project
        </Link>
      </div>

      {/* Projects Grid */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
          },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {projects.map((p) => (
          <motion.div
            key={p.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <Link
              to={`/project/${p.id}`}
              className="group block bg-slate-900/80 backdrop-blur p-6 rounded-2xl border border-slate-800 hover:border-indigo-500 transition shadow-lg hover:shadow-indigo-500/20"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold group-hover:text-indigo-400 transition">
                  {p.name}
                </h3>
                <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded-md">
                  Kanban
                </span>
              </div>

              <p className="text-slate-400 text-sm mt-2">
                {p.issues} open issues
              </p>

              <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
                <span>Last updated today</span>
                <span className="group-hover:translate-x-1 transition">
                  →
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
