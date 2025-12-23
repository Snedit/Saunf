import Sidebar from "../components/Sidebar";

export default function AppLayout({ children }) {
  return (
    <div className="flex bg-slate-950 min-h-screen text-white">
      <Sidebar />

      {/* Main content */}
      <main className="ml-64 w-full p-6">
        {children}
      </main>
    </div>
  );
}
