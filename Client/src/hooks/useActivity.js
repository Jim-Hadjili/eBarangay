import { useState, useEffect } from "react";
import { getToken } from "../utils/session";
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const useActivity = (limit = 20) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const token = getToken();

      const response = await fetch(
        `${API_URL}/activity/recent?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }

      const data = await response.json();
      setActivities(data.activities);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching activities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchActivities();

    // Setup socket connection
    const socket = io(SOCKET_URL);

    // Join dashboard room
    socket.emit("joinDashboard");

    // Listen for activity updates
    socket.on("activityUpdate", () => {
      console.log("Received activity update");
      fetchActivities();
    });

    // Cleanup
    return () => {
      socket.emit("leaveDashboard");
      socket.disconnect();
    };
  }, [limit]);

  return { activities, loading, error, refetch: fetchActivities };
};
