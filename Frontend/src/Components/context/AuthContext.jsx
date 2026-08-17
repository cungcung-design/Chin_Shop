import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

/** Profile fields (name/email) are cached alongside the token for display. */
const readStoredProfile = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    return {};
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // logged-in user
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          console.log("Token expired, removing");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("user");
          setUser(null);
        } else {
          const profile = readStoredProfile();
          setUser({
            id: decoded.id,
            role: decoded.role,
            name: profile.name || "",
            email: profile.email || "",
            token,
          });
        }
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("token");
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  /** Single place that persists a successful login. */
  const login = (token, profile) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", profile.role);
    localStorage.setItem("user", JSON.stringify(profile));

    setUser({
      id: profile.id,
      role: profile.role,
      name: profile.name || "",
      email: profile.email || "",
      token,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
