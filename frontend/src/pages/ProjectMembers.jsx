import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProjectMembers() {
  const { projectId } = useParams();
  const [email, setEmail] = useState("");
  const [members, setMembers] = useState([]);

  useEffect(() => {
    async function fetchMembers() {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/projects/${projectId}/members`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res.data)
      setMembers(res.data.members);
    }
    fetchMembers();
  }, [projectId]);

  const addMember = async () => {
    if (!email) return;

    const token = localStorage.getItem("token");
    await axios.post(
      `http://localhost:5000/api/projects/${projectId}/members`,
      { email },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setEmail("");
    window.location.reload(); // fine for now, optimize later
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Project Members</h1>

      <div className="flex gap-3 mb-6">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="User email"
          className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700"
        />
        <button
          onClick={addMember}
          className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-semibold"
        >
          Add
        </button>
      </div>

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
