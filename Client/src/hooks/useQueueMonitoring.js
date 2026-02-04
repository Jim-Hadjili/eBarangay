// Create Client/src/hooks/useQueueMonitoring.js

import { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import { getToken } from "../utils/session";

const SOCKET_URL = import.meta.env.VITE_API_URL.replace(/\/api$/, "");

export const useQueueMonitoring = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActiveQueues = useCallback(async () => {
    try {
      const token = getToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/queue/active-queues`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch active queues");
      }

      const data = await response.json();
      setServices(data.services || []);
      setError(null);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching active queues:", err);
      setServices([]);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchActiveQueues();

    // Setup socket connection for real-time updates
    const socket = io(SOCKET_URL);

    // Join dashboard room to receive updates
    socket.emit("joinDashboard");

    // Listen for queue updates
    const handleQueueUpdate = () => {
      fetchActiveQueues();
    };

    socket.on("dashboardUpdate", handleQueueUpdate);
    socket.on("activityUpdate", handleQueueUpdate);

    // Cleanup
    return () => {
      socket.off("dashboardUpdate", handleQueueUpdate);
      socket.off("activityUpdate", handleQueueUpdate);
      socket.emit("leaveDashboard");
      socket.disconnect();
    };
  }, [fetchActiveQueues]);

  return { services, loading, error, refetch: fetchActiveQueues };
};
