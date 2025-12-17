import { motion } from "framer-motion";


export default function Project() {
const columns = ["todo", "in-progress", "done"];


return (
<div className="p-8">
<h1 className="text-2xl font-bold mb-6">Kanban Board</h1>
<div className="grid grid-cols-3 gap-6">
{columns.map((col) => (
<div key={col} className="bg-slate-900 rounded-lg p-4">
<h3 className="capitalize mb-4">{col}</h3>
<motion.div
whileHover={{ scale: 1.02 }}
className="bg-slate-800 p-3 rounded mb-3"
>
Sample Issue
</motion.div>
</div>
))}
</div>
</div>
);
}