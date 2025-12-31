import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

export default function IssueDetails() {
  const { issueId } = useParams();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/issues/${issueId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIssue(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [issueId]);

  const handleDelete = async () => {
    if (!confirm("Delete this issue? This action is irreversible.")) return;

    try {
      setDeleting(true);
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/issues/${issueId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(-1); // back to issues list
    } catch (err) {
      alert("Failed to delete issue");
    } finally {
      setDeleting(false);
    }
  };

  if (loading)
    return <p className="text-center text-slate-400 mt-24">Loading issue…</p>;

  if (!issue)
    return <p className="text-center text-red-400 mt-24">Issue not found</p>;

  return (
    <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* MAIN */}
      <div className="lg:col-span-2 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-semibold tracking-tight">
            {issue.title}
          </h1>

          <div className="flex gap-2 mt-3">
            <Pill color="blue">{issue.type}</Pill>
            <Pill color="emerald">{issue.status}</Pill>
            <Pill color="amber">{issue.priority}</Pill>
          </div>
        </motion.div>

        {/* DESCRIPTION */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
          <h3 className="text-sm font-medium text-slate-300 mb-3">
            Description
          </h3>
          <p className="text-slate-400 leading-relaxed">
            {issue.description || "No description provided."}
          </p>
        </section>

        {/* COMMENTS (future-proofed) */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
          <h3 className="text-sm font-medium text-slate-300 mb-3">
            Activity
          </h3>
          <p className="text-slate-500 text-sm">No comments yet.</p>
        </section>

        {/* DANGER ZONE */}
        <section className="border border-red-900/40 bg-red-950/30 rounded-xl p-6">
          <h3 className="text-sm font-medium text-red-400 mb-2">
            Delete This Issue?
          </h3>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm px-4 py-2 rounded-md bg-red-600/90 hover:bg-red-600 disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete Issue"}
          </button>
        </section>
      </div>

      {/* SIDEBAR */}
      <aside className="sticky top-24 h-fit space-y-5 rounded-xl border border-slate-800 bg-slate-900/70 p-6">
        <SidebarItem label="Assignee" value={issue.assignee?.name || "Unassigned"} />
        <SidebarItem label="Created By" value={issue.createdBy?.name} />
        <SidebarItem label="Status" value={issue.status} />
        <SidebarItem label="Priority" value={issue.priority} />
        <SidebarItem label="Type" value={issue.type} />
      </aside>
    </div>
  );
}

/* -------------------- helpers -------------------- */

function SidebarItem({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="text-sm font-medium capitalize text-slate-200">
        {value}
      </p>
    </div>
  );
}

function Pill({ children, color }) {
  const colors = {
    blue: "bg-blue-500/15 text-blue-400",
    emerald: "bg-emerald-500/15 text-emerald-400",
    amber: "bg-amber-500/15 text-amber-400",
  };

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full capitalize ${colors[color]}`}
    >
      {children}
    </span>
  );
}
