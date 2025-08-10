// routes/MainRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Public pages
import Landing from "../pages/Landing";
import Register from "../pages/Register";
import Login from "../pages/Login";

// Protected pages
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "./PrivateRoute";

export default function MainRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
