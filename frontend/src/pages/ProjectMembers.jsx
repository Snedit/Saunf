import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProjectMembers() {
  const { projectId } = useParams();

  const [email, setEmail] = useState("");
  const [members, setMembers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [results, setResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const fetchMembers = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `http://localhost:5000/api/projects/${projectId}/members`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setMembers(res.data.members);
  };
  useEffect(() => {
    fetchMembers();
  }, [projectId]);

  /* ---------------- SEARCH ---------------- */

  useEffect(() => {
    if (!email || selectedUser) {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setLoadingSearch(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/users/search?q=${email}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setResults(res.data.users);
      } finally {
        setLoadingSearch(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [email, selectedUser]);

const addMember = async () => {
  if (!selectedUser) return;

  const token = localStorage.getItem("token");
  await axios.post(
    `http://localhost:5000/api/projects/${projectId}/members`,
    { email: selectedUser.email },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  setSelectedUser(null);
  setEmail("");
  fetchMembers();
};


  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Project Members</h1>

      {/* ADD MEMBER */}
      <div className="relative mb-6">
        <div className="relative flex gap-3">
          <input
            value={email}
            disabled={!!selectedUser}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Search by name or email"
            className={`flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700
      ${selectedUser ? "opacity-60 cursor-not-allowed" : ""}`}
          />

          {selectedUser && (
            <button
              onClick={() => {
                setSelectedUser(null);
                setEmail("");
                setResults([]);
              }}
              className="absolute left-100 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-400"
            >
              ✕
            </button>
          )}

          <button
            onClick={addMember}
            disabled={!selectedUser}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-semibold disabled:opacity-50"
          >
            Add
          </button>
        </div>

        {/* SEARCH RESULTS */}
        {results.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
            {results.map((u) => (
              <div
                key={u._id}
                onClick={() => {
                  setSelectedUser(u);
                  setEmail(u.email);
                  setResults([]);
                }}
                className="px-4 py-3 cursor-pointer hover:bg-slate-800"
              >
                <p className="font-medium">{u.name}</p>
                <p className="text-sm text-slate-400">{u.email}</p>
              </div>
            ))}
          </div>
        )}

        {loadingSearch && (
          <p className="text-xs text-slate-500 mt-1">Searching…</p>
        )}
      </div>

      {/* MEMBERS LIST */}
      <div className="space-y-3">
        {members.map((m) => (
          <div
            key={m._id}
            className="bg-slate-900 p-4 rounded-lg border border-slate-800"
          >
            <p className="font-medium">{m.name}</p>
            <p className="text-sm text-slate-400">{m.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
