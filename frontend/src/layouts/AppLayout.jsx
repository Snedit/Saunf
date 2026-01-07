import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="flex bg-slate-950 min-h-screen text-white">
      <Sidebar />

      {/* Main content */}
      <main className="ml-64 w-full p-6">
        <Outlet />
      </main>
    </div>
  );
}
