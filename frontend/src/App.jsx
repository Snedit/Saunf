import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Hero from "./pages/Hero.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Project from "./pages/Project.jsx";


export default function App() {
return (
<div className="min-h-screen bg-slate-950 text-slate-100">
<Navbar />
<Routes>
<Route path="/" element={<Hero />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/project/:projectId" element={<Project />} />
</Routes>
</div>
);
}