import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import PublicHome from "@/components/PublicHome";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/AdminDashboard";
import ProtectedRoute from "@/auth/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <BrowserRouter>
      <Helmet>
        <title>Titik Kode Studio - Professional Web Development Services</title>
        <meta name="description" content="WebCraft Agency delivers cutting-edge web development solutions." />
      </Helmet>

      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicHome />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Admin */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster />
    </BrowserRouter>
  );
}

export default App;
