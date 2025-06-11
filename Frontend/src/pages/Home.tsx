import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Home() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.get(BACKEND_URL); // Correct usage
        setMessage(response.data.message);
        setLoading(false); // Set loading to false after success
      } catch (err) {
        console.error("Error fetching API:", err);
        setError("Failed to fetch data.");
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchMessage();
  }, []);

  return <div>{loading ? "Loading..." : error ? error : message}</div>;
}
