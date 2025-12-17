import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-transparent" />

      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative w-full max-w-md bg-slate-900/90 backdrop-blur p-8 rounded-2xl border border-slate-800 shadow-2xl"
      >
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold">Welcome back</h2>
          <p className="text-slate-400 text-sm mt-1">
            Sign in to continue to IssueFlow
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:border-indigo-500 transition"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Helpers */}
        <div className="flex justify-between items-center mt-4 text-sm">
          <label className="flex items-center gap-2 text-slate-400">
            <input type="checkbox" className="accent-indigo-500" />
            Remember me
          </label>
          <Link
            to="/forgot-password"
            className="text-indigo-400 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* CTA */}
        <button className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl font-semibold transition shadow-lg shadow-indigo-600/30">
          Sign in
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-slate-400 mt-6">
          New here?{" "}
          <Link to="/register" className="text-indigo-400 hover:underline">
            Create an account
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
