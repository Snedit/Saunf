import axios from "axios";
import { useState } from "react";

function AddIssueModal({ projectId, onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("task");
  const [priority, setPriority] = useState("low");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `http://localhost:5000/api/issues/${projectId}`,
        {
          title,
          description,
          type,
          priority,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onCreated(res.data); // optimistic update
      onClose();
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-800"
      >
        <h2 className="text-xl font-bold mb-4">Create Issue</h2>

        <div className="space-y-3">
          <input
            placeholder="Issue title"
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700"
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Description"
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700"
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex gap-3">
            <select
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="task">Task</option>
              <option value="bug">Bug</option>
              <option value="story">Story</option>
            </select>

            <select
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="bg-indigo-600 px-5 py-2 rounded-lg font-semibold"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
