import { Link } from "react-router-dom";


export default function Navbar() {
return (
<nav className="flex items-center justify-between px-8 py-4 border-b border-slate-800">
<Link to="/" className="text-xl font-bold">IssueFlow</Link>
<div className="space-x-6">
<Link to="/login">Login</Link>
<Link to="/register" className="bg-indigo-600 px-4 py-2 rounded">Get Started</Link>
</div>
</nav>
);
}