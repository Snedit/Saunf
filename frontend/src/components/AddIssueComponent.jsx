import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AddIssueModal({ projectId, onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("task");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("todo");

  const [assignee, setAssignee] = useState("");
  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH PROJECT MEMBERS ---------------- */
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/projects/${projectId}/members`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMembers(res.data.members);
      } catch (err) {
        console.error("Failed to fetch members", err);
      }
    })();
  }, [projectId]);

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `http://localhost:5000/api/issues/${projectId}`,
        {
          title,
          description,
          type,
          priority,
          status,
          assignee: assignee || null, // send null if unassigned
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onCreated(res.data);
      onClose();
    } catch (err) {
      console.error("Issue creation failed:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <motion.form
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onSubmit={handleSubmit}
        className="bg-slate-900 w-full max-w-md rounded-2xl p-6 border border-slate-800"
      >
        <h2 className="text-xl font-semibold mb-4">Create Issue</h2>

        <div className="space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Issue title"
            required
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700"
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
            >
              <option value="task">Task</option>
              <option value="bug">Bug</option>
              <option value="story">Story</option>
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 w-full"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          {/* 🔥 ASSIGNEE */}
          <select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 w-full"
          >
            <option value="">Unassigned</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name} ({m.email})
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-semibold"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
