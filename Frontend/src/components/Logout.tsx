import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function Logout() {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem("token")); // ✅ Initialize from localStorage

  const handleLogout = async () => {
    if (!token) {
      console.log("No token found, navigating to /login...");
      navigate("/login", { replace: true });
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/logout`,
        {}, // Empty body
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null); // ✅ Update state
        toast.success(response.data.message || "Logged out successfully!", {
          position: "top-right",
          duration: 2000,
        });

        navigate("/login", { replace: true });
      }
    } catch (error: any) {
      console.error(
        "Logout API call failed:",
        error.response?.data || error.message
      );
      toast.error("Logout failed. Please try again.", {
        position: "top-right",
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  return (
    <button onClick={handleLogout} className="cursor-pointer">
      Logout
    </button>
  );
}
