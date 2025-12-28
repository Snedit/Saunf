import { Routes, Route } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";
import RequireAuth from "./components/RequireAuth";

import Hero from "./pages/Hero";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Project from "./pages/Project";
import Issues from "./pages/Issues";

export default function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <Hero />
          </PublicLayout>
        }
      />

      <Route
        path="/login"
        element={
          <PublicLayout>
            <Login />
          </PublicLayout>
        }
      />

      <Route
        path="/register"
        element={
          <PublicLayout>
            <Register />
          </PublicLayout>
        }
      />

      {/* Protected pages */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </RequireAuth>
        }
      />

      <Route
        path="/issues"
        element={
          <RequireAuth>
            <AppLayout>
              <Issues />
            </AppLayout>
          </RequireAuth>
        }
      />

      <Route
        path="/project/:projectId"
        element={
          <RequireAuth>
            <AppLayout>
              <Project />
            </AppLayout>
          </RequireAuth>
        }
      />
    </Routes>
  );
}
