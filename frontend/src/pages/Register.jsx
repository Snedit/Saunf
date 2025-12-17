import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-transparent" />

      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-slate-900/90 backdrop-blur p-8 rounded-2xl w-full max-w-md border border-slate-800 shadow-2xl"
      >
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold">Create your account</h2>
          <p className="text-slate-400 text-sm mt-1">
            Start tracking work in minutes
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <input
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:border-indigo-500 transition"
            placeholder="Full name"
          />
          <input
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:border-indigo-500 transition"
            placeholder="Email address"
          />
          <input
            type="password"
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:border-indigo-500 transition"
            placeholder="Password"
          />
        </div>

        {/* CTA */}
        <button className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl font-semibold transition shadow-lg shadow-indigo-600/30">
          Create account
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-400 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
