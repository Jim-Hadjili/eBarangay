// Create Client/src/hooks/useQueueMonitoring.js

import { useState, useEffect, useCallback } from "react";
import socketService from "../services/socketService";
import { getToken } from "../utils/session";

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
      console.log("Active queues fetched:", data);
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

    // Use the singleton socket service
    const socket = socketService.getSocket();

    // Join dashboard room to receive updates
    socketService.emit("joinDashboard");

    // Listen for queue updates
    const handleQueueUpdate = () => {
      console.log("Queue update received, refetching...");
      fetchActiveQueues();
    };

    socketService.on("dashboardUpdate", handleQueueUpdate);
    socketService.on("activityUpdate", handleQueueUpdate);

    // Cleanup
    return () => {
      socketService.off("dashboardUpdate", handleQueueUpdate);
      socketService.off("activityUpdate", handleQueueUpdate);
      socketService.emit("leaveDashboard");
    };
  }, [fetchActiveQueues]);

  return { services, loading, error, refetch: fetchActiveQueues };
};
