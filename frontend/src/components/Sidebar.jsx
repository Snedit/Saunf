import { NavLink, useParams, useNavigate } from "react-router-dom";
import ProjectSelector from "./ProjectSelector";

const navItem =
  "flex items-center gap-3 px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition";

const activeItem =
  "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30";

export default function Sidebar() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const projectPath = projectId ? `/project/${projectId}` : null;

  return (
    <aside className="w-64 h-screen bg-slate-900 border-r border-slate-800 fixed left-0 top-0">
      {/* Logo + Selector */}
      <div className="px-6 py-5 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white">Saunf</h1>
        <p className="text-xs text-slate-400 mb-3">Project Manager</p>

        <ProjectSelector />
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4 space-y-1">
        <NavLink
          to={projectPath ? `${projectPath}/dashboard` : "/dashboard"}
          className={({ isActive }) =>
            `${navItem} ${isActive ? activeItem : ""}`
          }
        >
          🏠 Dashboard
        </NavLink>

        <NavLink
          to={projectPath ? `${projectPath}/issues` : "#"}
          className={`${navItem} ${!projectId && "opacity-50 pointer-events-none"}`}
        >
          🧩 Issues
        </NavLink>

        <NavLink
          to={projectPath ? `${projectPath}/members` : "#"}
          className={`${navItem} ${!projectId && "opacity-50 pointer-events-none"}`}
        >
          👥 Members
        </NavLink>

        <NavLink
          to={projectPath ? `${projectPath}/mywork` : "#"}
          className={`${navItem} ${!projectId && "opacity-50 pointer-events-none"}`}
        >
          📌 My Work
        </NavLink>
      </nav>

      {/* Bottom */}
      <div className="absolute bottom-0 w-full px-3 py-4 border-t border-slate-800">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `${navItem} ${isActive ? activeItem : ""}`
          }
        >
          ⚙️ Settings
        </NavLink>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
