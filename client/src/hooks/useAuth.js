import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  // Wrap fetchUserData in useCallback
  const fetchUserData = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      localStorage.removeItem("token"); // Remove invalid token
      setUser(null);
    }
  }, [token]); // ✅ Add token as a dependency

  useEffect(() => {
    fetchUserData(); // ✅ Now safe to use inside useEffect
  }, [fetchUserData]); // ✅ No more ESLint warning

  return { user, setUser };
};

export default useAuth;
