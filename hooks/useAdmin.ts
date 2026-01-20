"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAdmin() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth");
    setIsAdmin(adminAuth === "true");
  }, []);

  const logout = () => {
    localStorage.removeItem("adminAuth");
    setIsAdmin(false);
    router.push("/");
    router.refresh();
  };

  return { isAdmin, logout };
}