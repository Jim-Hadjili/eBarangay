import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const useServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/services`);

      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }

      const data = await response.json();
      setServices(data.services || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching services:", err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchServices();

    // Setup socket connection for real-time updates
    const socket = io(SOCKET_URL);

    // Join dashboard room to receive updates
    socket.emit("joinDashboard");

    // Listen for dashboard updates (which occur when queue changes)
    socket.on("dashboardUpdate", () => {
      fetchServices();
    });

    // Listen for activity updates (service created/updated)
    socket.on("activityUpdate", () => {
      fetchServices();
    });

    // Cleanup
    return () => {
      socket.emit("leaveDashboard");
      socket.disconnect();
    };
  }, []);

  return { services, loading, error, refetch: fetchServices };
};
