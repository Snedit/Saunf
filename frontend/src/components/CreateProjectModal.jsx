import axios from "axios";
import { useState } from "react";
import { motion } from "framer-motion";
function CreateProjectModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name || !key) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `http://localhost:5000/api/projects`,
        { name, key, description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onCreated(res.data);
    } catch (err) {
      console.error("Failed to create project", err);
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
        <h2 className="text-xl font-bold mb-4">Create Project</h2>

        <div className="space-y-3">
          <input
            placeholder="Project name"
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Key (e.g. PROJ)"
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700"
            onChange={(e) => setKey(e.target.value)}
          />
          <textarea
            placeholder="Description"
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-400 hover:text-white"
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

export default CreateProjectModal;