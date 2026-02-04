import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { getToken } from "../utils/session";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const socket = io(API_BASE_URL.replace("/api", ""));

export default function useQueueHistory() {
  const [queueHistory, setQueueHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQueueHistory();

    // Join patient's queue history room for real-time updates
    socket.emit("joinQueueHistory");

    // Listen for queue history updates
    socket.on("queueHistoryUpdate", (updatedQueue) => {
      setQueueHistory((prevHistory) => {
        const index = prevHistory.findIndex((q) => q._id === updatedQueue._id);
        if (index !== -1) {
          // Update existing queue
          const newHistory = [...prevHistory];
          newHistory[index] = updatedQueue;
          return newHistory;
        } else {
          // Add new queue to history
          return [updatedQueue, ...prevHistory];
        }
      });
    });

    return () => {
      socket.off("queueHistoryUpdate");
      socket.emit("leaveQueueHistory");
    };
  }, []);

  const fetchQueueHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();

      const response = await fetch(`${API_BASE_URL}/queue/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch queue history");
      }

      const data = await response.json();
      setQueueHistory(data.queueHistory || []);
    } catch (err) {
      console.error("Error fetching queue history:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    queueHistory,
    loading,
    error,
    refetch: fetchQueueHistory,
  };
}
