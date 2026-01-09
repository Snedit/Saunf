import axios  from "axios";
import { useEffect, useState } from "react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios.get("/api/projects", authHeaders())
      .then(res => setProjects(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Projects</h1>

      {projects.map(p => (
        <Link
          key={p._id}
          to={`/project/${p._id}/dashboard`}
          className="block p-4 border mt-3 rounded"
        >
          {p.name}
        </Link>
      ))}
    </div>
  );
}
