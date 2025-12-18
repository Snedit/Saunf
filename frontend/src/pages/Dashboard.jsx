import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import CreateProjectModal from "../components/CreateProjectModal.jsx";


export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/projects`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProjects(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const handleProjectCreated = (project) => {
    setProjects((prev) => [project, ...prev]);
    setShowCreate(false);
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-slate-400">
        Loading projects…
      </div>
    );
  }

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

        <button
          onClick={() => setShowCreate(true)}
          className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-600/30 transition"
        >
          + New Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <Link
            key={p._id}
            to={`/project/${p._id}`}
            className="group block bg-slate-900/80 p-6 rounded-2xl border border-slate-800 hover:border-indigo-500 transition"
          >
            <h3 className="text-lg font-semibold">{p.name}</h3>
            <p className="text-slate-400 text-sm mt-2">
              {p.issueCount ?? 0} issues
            </p>
          </Link>
        ))}
      </div>

      {/* Create Project Modal */}
      {showCreate && (
        <CreateProjectModal
          onClose={() => setShowCreate(false)}
          onCreated={handleProjectCreated}
        />
      )}
    </div>
  );
}
