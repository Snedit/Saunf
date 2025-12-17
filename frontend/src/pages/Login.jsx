export default function Login() {
  return (
    <div className="flex justify-center items-center h-[80vh]">
      <form className="bg-slate-900 p-8 rounded-lg w-96 space-y-4">
        <h2 className="text-2xl font-bold">Sign In</h2>
        <input className="input" placeholder="Email" />
        <input className="input" placeholder="Password" type="password" />
        <button className="btn-primary w-full">Login</button>
      </form>
    </div>
  );
}
