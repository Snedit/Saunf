import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";

export default function AddIssueModal({ projectId, onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Task");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("todo");
  const [assignee, setAssignee] = useState(null); // 🔥 backend expects it
  const [loading, setLoading] = useState(false);

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
          type: type.toLowerCase(),
          priority: priority.toLowerCase(),
          status,
          assignee, // null is fine
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // push new issue into board
      onCreated(res.data);
      // onClose();
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
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:border-indigo-500 outline-none"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:border-indigo-500 outline-none"
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
            >
              <option>Task</option>
              <option>Bug</option>
              <option>Story</option>
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
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
