import { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL.replace(/\/api$/, "");

export const useServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/services`);

      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }

      const data = await response.json();
      setServices(data.services || []);
      setError(null);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching services:", err);
      setServices([]);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchServices();

    // Setup socket connection for real-time updates
    const socket = io(SOCKET_URL);

    // Join dashboard room to receive updates
    socket.emit("joinDashboard");

    // Single consolidated handler for any service updates
    const handleServiceUpdate = () => {
      fetchServices();
    };

    // Listen for dashboard updates (which occur when queue changes)
    socket.on("dashboardUpdate", handleServiceUpdate);

    // Listen for activity updates (service created/updated)
    socket.on("activityUpdate", handleServiceUpdate);

    // Cleanup
    return () => {
      socket.off("dashboardUpdate", handleServiceUpdate);
      socket.off("activityUpdate", handleServiceUpdate);
      socket.emit("leaveDashboard");
      socket.disconnect();
    };
  }, [fetchServices]);

  return { services, loading, error };
};
