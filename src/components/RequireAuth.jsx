// src/components/RequireAuth.jsx
import React, { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export default function RequireAuth({ children }) {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecking(false);
    });
    return unsub;
  }, []);

  if (checking) {
    // simple inline loader — replace with your Vortex / spinner if you want
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-2">Checking authentication…</div>
          <div className="loader" /> {/* or your Vortex component */}
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login and preserve the page the user attempted to visit
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Authenticated — render children (protected page)
  return children;
}
