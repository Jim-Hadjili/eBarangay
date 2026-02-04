import { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import { getToken } from "../utils/session";

export const SOCKET_URL = import.meta.env.VITE_API_URL.replace(/\/api$/, "");

export const usePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPatients = useCallback(async () => {
    try {
      const token = getToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/dashboard/patients`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }

      const data = await response.json();
      setPatients(data.patients || []);
      setError(null);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching patients:", err);
      setPatients([]);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchPatients();

    // Setup socket connection for real-time updates
    const socket = io(SOCKET_URL);

    // Join dashboard room to receive updates
    socket.emit("joinDashboard");

    // Listen for dashboard updates
    const handleUpdate = () => {
      fetchPatients();
    };

    socket.on("dashboardUpdate", handleUpdate);
    socket.on("activityUpdate", handleUpdate);

    // Cleanup
    return () => {
      socket.off("dashboardUpdate", handleUpdate);
      socket.off("activityUpdate", handleUpdate);
      socket.emit("leaveDashboard");
      socket.disconnect();
    };
  }, [fetchPatients]);

  return { patients, loading, error, refetch: fetchPatients };
};
