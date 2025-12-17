import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Your Projects</h1>
      <div className="grid grid-cols-3 gap-6">
        {[1, 2, 3].map((p) => (
          <Link
            key={p}
            to={`/project/${p}`}
            className="bg-slate-900 p-6 rounded-lg hover:border-indigo-500 border border-slate-800"
          >
            <h3 className="font-semibold">Project {p}</h3>
            <p className="text-sm text-slate-400">Kanban board</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
