import { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL.replace(/\/api$/, "");

/**
 * Custom hook to fetch and listen for real-time updates of the currently serving queue
 * for a specific service. This helps patients track queue progress in real-time.
 *
 * @param {string} serviceId - The ID of the service to track
 * @returns {Object} - Contains currentlyServing (queue info) and loading state
 */
export const useServiceQueueStatus = (serviceId) => {
  const [currentlyServing, setCurrentlyServing] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentQueue = useCallback(async () => {
    if (!serviceId) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/queue/service/${serviceId}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch queue status");
      }

      const data = await response.json();

      // Find the queue that is currently being served
      const servingQueue = data.queue?.find((q) => q.status === "serving");

      console.log("Queue status data:", {
        serviceId,
        totalQueues: data.queue?.length,
        servingQueue,
        allQueues: data.queue,
      });

      setCurrentlyServing(
        servingQueue
          ? {
              queueCode: servingQueue.queueCode,
              queueNumber: servingQueue.queueNumber,
            }
          : null,
      );
      setLoading(false);
    } catch (err) {
      console.error("Error fetching current queue:", err);
      setCurrentlyServing(null);
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    if (!serviceId) {
      setLoading(false);
      return;
    }

    // Initial fetch
    fetchCurrentQueue();

    // Setup socket connection for real-time updates
    const socket = io(SOCKET_URL);

    // Join the service room to receive real-time updates
    socket.emit("joinService", serviceId);

    // Listen for queue updates for this service
    const handleQueueUpdate = (data) => {
      // Check if update is for this service
      if (data.serviceId === serviceId || data.service === serviceId) {
        fetchCurrentQueue();
      }
    };

    // Listen for various events that might update the queue status
    socket.on("queueUpdated", handleQueueUpdate);
    socket.on("dashboardUpdate", fetchCurrentQueue);
    socket.on("queueCalled", (data) => {
      // When a new queue is called, refresh the status
      fetchCurrentQueue();
    });

    // Cleanup on unmount
    return () => {
      socket.off("queueUpdated", handleQueueUpdate);
      socket.off("dashboardUpdate", fetchCurrentQueue);
      socket.off("queueCalled", fetchCurrentQueue);
      socket.emit("leaveService", serviceId);
      socket.disconnect();
    };
  }, [serviceId, fetchCurrentQueue]);

  return { currentlyServing, loading };
};
