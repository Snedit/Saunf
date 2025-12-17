export default function Register() {
return (
<div className="flex justify-center items-center h-[80vh]">
<form className="bg-slate-900 p-8 rounded-lg w-96 space-y-4">
<h2 className="text-2xl font-bold">Create Account</h2>
<input className="input" placeholder="Name" />
<input className="input" placeholder="Email" />
<input className="input" placeholder="Password" type="password" />
<button className="btn-primary w-full">Register</button>
</form>
</div>
);
}