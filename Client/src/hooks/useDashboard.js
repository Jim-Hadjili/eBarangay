import { useState, useEffect } from "react";
import { getToken } from "../utils/session";
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const useDashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeServices: 0,
    queueToday: 0,
    totalStaff: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = getToken();

      const response = await fetch(`${API_URL}/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }

      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchStats();

    // Setup socket connection
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Join dashboard room
    newSocket.emit("joinDashboard");

    // Listen for dashboard updates
    newSocket.on("dashboardUpdate", (updatedStats) => {
      console.log("Received dashboard update:", updatedStats);
      setStats(updatedStats);
    });

    // Cleanup
    return () => {
      newSocket.emit("leaveDashboard");
      newSocket.disconnect();
    };
  }, []);

  return { stats, loading, error, refetch: fetchStats };
};
