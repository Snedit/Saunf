import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const { projectId } = useParams();
  const [stats, setStats] = useState(null);
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const token = localStorage.getItem("token");

        const [statsRes, issuesRes] = await Promise.all([
          axios.get(
            `http://localhost:5000/api/projects/${projectId}/stats`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get(
            `http://localhost:5000/api/issues/project/${projectId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
        ]);

        setStats(statsRes.data);
        setRecentIssues(issuesRes.data.issues || []);
      } catch (err) {
        console.error(err);
        alert("Dashboard failed to load. Backend having a bad day.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [projectId]);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-slate-400">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="px-8 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Project Dashboard</h1>
        <p className="text-slate-400 mt-1">
          Overview of what’s burning right now
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard label="Total Issues" value={stats.totalIssues} />
        <StatCard label="Open Issues" value={stats.openIssues} />
        <StatCard label="Completed" value={stats.doneIssues} />
        <StatCard label="Members" value={stats.membersCount} />
      </div>

      {/* Recent Issues */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Issues</h2>
          <Link
            to={`/project/${projectId}/issues`}
            className="text-sm text-indigo-400 hover:underline"
          >
            View all →
          </Link>
        </div>

        {recentIssues.length === 0 ? (
          <p className="text-slate-400 text-sm">
            No issues yet. Either perfect project or nobody’s working.
          </p>
        ) : (
          <div className="space-y-3">
            {recentIssues.map((issue) => (
              <Link
                key={issue._id}
                to={`/issue/${issue._id}`}
                className="block p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{issue.title}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {issue.type} • {issue.priority}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      issue.status === "done"
                        ? "bg-green-500/20 text-green-400"
                        : issue.status === "in-progress"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-slate-500/20 text-slate-300"
                    }`}
                  >
                    {issue.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-3xl font-bold text-white mt-2">{value ?? 0}</p>
    </div>
  );
}
