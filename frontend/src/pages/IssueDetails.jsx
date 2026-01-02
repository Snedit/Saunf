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
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [draftStatus, setDraftStatus] = useState(null);

  /* ---------------- COMMENTS (UI ONLY) ---------------- */
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  /* ---------------- FETCH ISSUE ---------------- */
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/issues/${issueId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIssue(res.data);
        setDraftStatus(res.data.status);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [issueId]);

  /* ---------------- DELETE ---------------- */
  const handleDelete = async () => {
    if (!confirm("Delete this issue? This action is irreversible.")) return;

    try {
      setDeleting(true);
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/issues/${issueId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(-1);
    } catch {
      alert("Failed to delete issue");
    } finally {
      setDeleting(false);
    }
  };

  /* ---------------- STATUS UPDATE ---------------- */
  const handleStatusChange = async (newStatus) => {
    if (newStatus === issue.status) return;

    try {
      setUpdatingStatus(true);
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `http://localhost:5000/api/issues/${issueId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIssue(res.data);
    } catch {
      alert("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  /* ---------------- COMMENT SUBMIT (UI ONLY) ---------------- */
  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    setPostingComment(true);

    // TEMP: local UI append (replace with API later)
    setComments((prev) => [
      ...prev,
      {
        _id: Date.now(),
        text: commentText,
        author: { name: "You" },
        createdAt: new Date(),
      },
    ]);

    setCommentText("");
    setPostingComment(false);
  };

  /* ---------------- STATES ---------------- */
  if (loading)
    return <p className="text-center text-slate-400 mt-24">Loading issue…</p>;

  if (!issue)
    return <p className="text-center text-red-400 mt-24">Issue not found</p>;

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* MAIN */}
      <div className="lg:col-span-2 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* DELETE BUTTON */}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="absolute top-0 right-0 text-sm px-3 py-1.5 rounded-md 
                       bg-red-600/90 hover:bg-red-600 disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>

          <h1 className="text-3xl font-semibold tracking-tight pr-24">
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

        {/* COMMENTS */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
          <h3 className="text-sm font-medium text-slate-300">Comments</h3>

          {comments.length === 0 ? (
            <p className="text-slate-500 text-sm">No comments yet.</p>
          ) : (
            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c._id} className="bg-slate-800/70 rounded-lg p-3">
                  <p className="text-sm text-slate-200">{c.text}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {c.author?.name} •{" "}
                    {new Date(c.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* ADD COMMENT */}
          <div className="pt-3 border-t border-slate-800">
            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment…"
              className="w-full rounded-md bg-slate-800 border border-slate-700 
                         px-3 py-2 text-sm focus:outline-none focus:ring-2 
                         focus:ring-indigo-500"
            />

            <div className="flex justify-end mt-2">
              <button
                onClick={handleAddComment}
                disabled={!commentText.trim() || postingComment}
                className="px-4 py-2 text-sm rounded-md bg-indigo-600 
                           hover:bg-indigo-500 disabled:opacity-50"
              >
                {postingComment ? "Posting…" : "Comment"}
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* SIDEBAR */}
      <aside className="sticky top-24 h-fit space-y-5 rounded-xl border border-slate-800 bg-slate-900/70 p-6">
        <SidebarItem
          label="Assignee"
          value={issue.assignee?.name || "Unassigned"}
        />
        <SidebarItem label="Created By" value={issue.createdBy?.name} />

        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
            Status
          </p>
          <select
            value={draftStatus}
            onChange={(e) => setDraftStatus(e.target.value)}
            disabled={updatingStatus}
            className="w-full rounded-md bg-slate-800 border border-slate-700 
                       px-3 py-2 text-sm capitalize focus:outline-none 
                       focus:ring-2 focus:ring-indigo-500"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        {draftStatus !== issue.status && (
          <button
            onClick={() => handleStatusChange(draftStatus)}
            disabled={updatingStatus}
            className="w-full rounded-md bg-indigo-600 hover:bg-indigo-500 
                       px-3 py-2 text-sm font-medium disabled:opacity-50"
          >
            {updatingStatus ? "Updating…" : "Confirm Status Change"}
          </button>
        )}

        <SidebarItem label="Priority" value={issue.priority} />
        <SidebarItem label="Type" value={issue.type} />
      </aside>
    </div>
  );
}

/* ---------------- HELPERS ---------------- */

function SidebarItem({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-sm font-medium capitalize text-slate-200">{value}</p>
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
