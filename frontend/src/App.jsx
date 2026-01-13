import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import AppHeader from "./components/AppHeader";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checked, setChecked] = useState(false);

  function logout() {
    localStorage.removeItem("user_id");
    setIsAuthenticated(false);
  }

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setChecked(true);
      return;
    }

    // בדיקת אמת מול השרת – אם המשתמש לא קיים, זה ייכשל
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    fetch(`/api/overview?year=${year}&month=${month}&user_id=${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("invalid user");
        setIsAuthenticated(true);
      })
      .catch(() => {
        localStorage.removeItem("user_id");
        setIsAuthenticated(false);
      })
      .finally(() => {
        setChecked(true);
      });
  }, []);

  if (!checked) return null;

  return (
    <BrowserRouter>
      {/* HEADER – תמיד קיים */}
      <AppHeader showLogout={isAuthenticated} onLogout={logout} />

      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Login onSuccess={() => setIsAuthenticated(true)} />
            )
          }
        />

        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Dashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
