import Navbar from "../components/Navbar";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      {children}
    </div>
  );
}
