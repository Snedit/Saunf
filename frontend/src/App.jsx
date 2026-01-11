import { Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";
import RequireAuth from "./components/RequireAuth";

import Hero from "./pages/Hero";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Project from "./pages/Project";
import ProjectMembers from "./pages/ProjectMembers";
import Issues from "./pages/Issues";
import IssueDetails from "./pages/IssueDetails";
import MyWork from "./pages/MyWork";

export default function App() {
  return (
    <Routes>
      {/* ---------- PUBLIC ---------- */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* ---------- PROTECTED ---------- */}
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        {/* Issue details (project inferred) */}

        {/* -------- PROJECT SCOPED -------- */}
        <Route path="/project/:projectId">
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="issues" element={<Issues />} />
          <Route path="members" element={<ProjectMembers />} />
          <Route path="mywork" element={<MyWork />} />
        <Route path="issue/:issueId" element={<IssueDetails />} />
        </Route>
      </Route>

      {/* ---------- CATCH ALL ---------- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
