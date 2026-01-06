import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const statusColors = {
  todo: "bg-slate-700 text-slate-300",
  "in-progress": "bg-yellow-500/20 text-yellow-400",
  done: "bg-green-500/20 text-green-400",
};

const priorityColors = {
  low: "bg-slate-700 text-slate-300",
  medium: "bg-orange-500/20 text-orange-400",
  high: "bg-red-500/20 text-red-400",
};

export default function MyWork() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyWork = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/projects/${projectId}/mywork`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setIssues(res.data.issues);
      } catch (err) {
        console.error(err);
        alert("Failed to load your work. Backend chose violence.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyWork();
  }, [projectId]);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400">
        Loading your assigned chaos…
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Work</h1>
        <p className="text-slate-400 text-sm">
          Issues currently assigned to you
        </p>
      </div>

      {/* Empty state */}
      {issues.length === 0 && (
        <div className="text-center text-slate-500 py-20">
          🎉 No issues assigned. Either you’re efficient or ignored.
        </div>
      )}

      {/* Issues */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {issues.map((issue) => (
          <motion.div
            key={issue._id}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/issue/${issue._id}`)}
            className="cursor-pointer bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500 transition"
          >
            {/* Title */}
            <h3 className="font-semibold text-lg mb-2">
              {issue.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-slate-400 mb-4 line-clamp-2">
              {issue.description || "No description provided"}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex gap-2">
                <span
                  className={`px-2 py-1 rounded ${statusColors[issue.status]}`}
                >
                  {issue.status}
                </span>

                <span
                  className={`px-2 py-1 rounded ${priorityColors[issue.priority]}`}
                >
                  {issue.priority}
                </span>
              </div>

              <span className="text-slate-500">
                📁 {issue.type}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
