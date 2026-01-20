"use client";

import { useState, useEffect } from "react";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth");
    setIsAdmin(adminAuth === "true");
  }, []);

  const logout = () => {
    localStorage.removeItem("adminAuth");
    setIsAdmin(false);
    window.location.href = "/";
  };

  return { isAdmin, logout };
}