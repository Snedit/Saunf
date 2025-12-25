import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const badge = {
  todo: "bg-indigo-500/10 text-indigo-400",
  "in-progress": "bg-yellow-500/10 text-yellow-400",
  done: "bg-green-500/10 text-green-400",
};

const priorityColor = {
  high: "text-red-400",
  medium: "text-yellow-400",
  low: "text-slate-400",
};

export default function Issues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchIssues() {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/issues", // <-- global issues route
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setIssues(res.data);
      } catch (err) {
        console.error("Failed to load issues", err);
      } finally {
        setLoading(false);
      }
    }

    fetchIssues();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-20 text-slate-400">
        Loading issues...
      </p>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">All Issues</h1>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 px-6 py-3 text-sm text-slate-400 border-b border-slate-800">
          <div className="col-span-4">Title</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Priority</div>
          <div className="col-span-2">Assignee</div>
        </div>

        {issues.map((issue) => (
          <motion.div
            key={issue._id}
            whileHover={{ backgroundColor: "rgba(99,102,241,0.05)" }}
            onClick={() => navigate(`/project/${issue.projectId}`)}
            className="grid grid-cols-12 px-6 py-4 text-sm cursor-pointer border-b border-slate-800 last:border-none"
          >
            <div className="col-span-4 font-medium">
              {issue.title}
              <p className="text-xs text-slate-500 mt-1">
                {issue.description || "No description"}
              </p>
            </div>

            <div className="col-span-2">
              <span
                className={`px-2 py-1 rounded text-xs ${badge[issue.status]}`}
              >
                {issue.status}
              </span>
            </div>

            <div className="col-span-2 capitalize">
              {issue.type}
            </div>

            <div className={`col-span-2 capitalize ${priorityColor[issue.priority]}`}>
              {issue.priority}
            </div>

            <div className="col-span-2 text-slate-300">
              {issue.assignee?.name || "Unassigned"}
            </div>
          </motion.div>
        ))}

        {issues.length === 0 && (
          <p className="text-center py-10 text-slate-500">
            No issues found
          </p>
        )}
      </div>
    </div>
  );
}
