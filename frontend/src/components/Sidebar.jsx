import { NavLink } from "react-router-dom";

const navItem =
  "flex items-center gap-3 px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition";

const activeItem =
  "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-slate-900 border-r border-slate-800 fixed left-0 top-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white">Saunf</h1>
        <p className="text-xs text-slate-400">Project Manager</p>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4 space-y-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${navItem} ${isActive ? activeItem : ""}`
          }
        >
          🏠 Dashboard
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `${navItem} ${isActive ? activeItem : ""}`
          }
        >
          📁 Projects
        </NavLink>

        <NavLink
          to="/issues"
          className={({ isActive }) =>
            `${navItem} ${isActive ? activeItem : ""}`
          }
        >
          🧩 Issues
        </NavLink>

        <NavLink
          to="/my-work"
          className={({ isActive }) =>
            `${navItem} ${isActive ? activeItem : ""}`
          }
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
            window.location.href = "/login";
          }}
          className="w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
