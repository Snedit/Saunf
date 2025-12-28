import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

export default function IssueDetails() {
  const { issueId } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIssue() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/issues/${issueId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIssue(res.data);
      } catch (err) {
        console.error("Failed to fetch issue", err);
      } finally {
        setLoading(false);
      }
    }

    fetchIssue();
  }, [issueId]);

  if (loading)
    return <p className="text-center text-slate-400 mt-20">Loading issue…</p>;

  if (!issue)
    return <p className="text-center text-red-400 mt-20">Issue not found</p>;

  return (
    <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT */}
      <div className="lg:col-span-2 space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold"
        >
          {issue.title}
        </motion.h1>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-slate-300">
            {issue.description || "No description provided."}
          </p>
        </div>

        {/* COMMENTS (placeholder) */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h3 className="font-semibold mb-4">Comments</h3>
          <p className="text-slate-500 text-sm">
            No comments yet.
          </p>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
        <Detail label="Status" value={issue.status} />
        <Detail label="Priority" value={issue.priority} />
        <Detail label="Type" value={issue.type} />
        <Detail
          label="Assignee"
          value={issue.assignee?.name || "Unassigned"}
        />
        <Detail
          label="Created By"
          value={issue.createdBy?.name}
        />
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-medium capitalize">{value}</p>
    </div>
  );
}
