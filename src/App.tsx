import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { ProjectSubmission } from "./pages/ProjectSubmission";
import { Judging } from "./pages/Judging";
import { Reports } from "./pages/Reports";
import { Leaderboard } from "./pages/Leaderboard";
import { LeaderboardStandalone } from "./pages/LeaderboardStandalone";
import { ProtectedRoute } from "./components/PrivateRoute";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Normal authentication - root route shows login page */}
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/submit"
          element={
            <ProtectedRoute>
              <Layout>
                <ProjectSubmission />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/judge"
          element={
            <ProtectedRoute>
              <Layout>
                <Judging />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Layout>
                <Reports />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Leaderboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/leaderboard-standalone" element={<LeaderboardStandalone />} />
      </Routes>
    </Router>
  );
};

export default App;
