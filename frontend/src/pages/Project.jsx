import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddIssueModal from "../components/AddIssueComponent.jsx";

const columns = [
  { id: "todo", label: "To Do", color: "border-indigo-500" },
  { id: "in-progress", label: "In Progress", color: "border-yellow-500" },
  { id: "done", label: "Done", color: "border-green-500" },
];

export default function Project() {
  const { projectId } = useParams();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddIssueOpen, setIsAddIssueOpen] = useState(false);

  /* ---------------- FETCH ISSUES ---------------- */
  useEffect(() => {
    async function fetchIssues() {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `http://localhost:5000/api/issues/project/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIssues(res.data);
      } catch (err) {
        console.error("Failed to fetch issues", err);
      } finally {
        setLoading(false);
      }
    }

    fetchIssues();
  }, [projectId]);

  /* ---------------- HANDLERS ---------------- */
  const toggleAddIssue = () => {
    setIsAddIssueOpen((prev) => !prev);
  };

  const handleIssueCreated = (newIssue) => {
    setIssues((prev) => [newIssue, ...prev]);
    setIsAddIssueOpen(false);
  };

  /* ---------------- RENDER ---------------- */
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Kanban Board</h1>
          <p className="text-slate-400 text-sm">
            Track issues across your workflow
          </p>
        </div>

        <button
          onClick={toggleAddIssue}
          className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition font-semibold shadow-lg shadow-indigo-600/30"
        >
          + New Issue
        </button>
      </div>

      {/* Add Issue Modal */}
      {isAddIssueOpen && (
        <AddIssueModal
          projectId={projectId}
          onClose={toggleAddIssue}
          onCreated={handleIssueCreated}
        />
      )}

      {/* Loading */}
      {loading && (
        <p className="text-slate-400 text-center mt-20">
          Loading issues...
        </p>
      )}

      {/* Board */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((col) => {
            const columnIssues = issues.filter(
              (issue) => issue.status === col.id
            );

            return (
              <div
                key={col.id}
                className="bg-slate-900 rounded-2xl p-4 border border-slate-800"
              >
                {/* Column header */}
                <div
                  className={`flex items-center justify-between mb-4 pb-2 border-b ${col.color}`}
                >
                  <h3 className="font-semibold">{col.label}</h3>
                  <span className="text-xs bg-slate-800 px-2 py-1 rounded-full">
                    {columnIssues.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3">
                  {columnIssues.map((issue) => (
                    <motion.div
                      key={issue._id}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-slate-800 rounded-xl p-4 border border-slate-700 cursor-pointer hover:border-indigo-500 transition"
                    >
                      <h4 className="font-medium mb-1">
                        {issue.title}
                      </h4>

                      <p className="text-xs text-slate-400 mb-3">
                        {issue.description || "No description"}
                      </p>

                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded">
                          {issue.type || "Task"}
                        </span>
                        <span>
                          👤 {issue.assignee?.name || "Unassigned"}
                        </span>
                      </div>
                    </motion.div>
                  ))}

                  {columnIssues.length === 0 && (
                    <div className="text-sm text-slate-500 text-center py-6">
                      No issues here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
