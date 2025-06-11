import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const checkAuthentication = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found. User is not authenticated.");
      return { success: false, message: "No token found" };
    }

    const response = await axios.get(`${BACKEND_URL}/is-auth`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    //console.log("Authentication Response:", response.data);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Authentication failed",
    };
  }
};
