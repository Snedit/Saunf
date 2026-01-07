import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useProject } from "../context/ProjectContext";

export default function ProjectSelector() {
  const { selectedProject, setSelectedProject } = useProject();
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProjects() {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    }
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const project = projects.find(p => p._id === e.target.value);
    setSelectedProject(project);
    navigate(`/project/${project._id}/dashboard`);
  };

  return (
    <select
      value={selectedProject?._id || ""}
      onChange={handleChange}
      className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg text-sm"
    >
      <option value="" disabled>
        Select project
      </option>

      {projects.map(p => (
        <option key={p._id} value={p._id}>
          {p.name}
        </option>
      ))}
    </select>
  );
}
