// Create Client/src/hooks/useMonitoring.js
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/session";
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;
const SOCKET_URL = API_URL.replace(/\/api$/, "");

export const useMonitoring = (serviceId) => {
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchServiceDetails = useCallback(async () => {
    try {
      const token = getToken();
      const response = await fetch(
        `${API_URL}/monitoring/service/${serviceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch service details");
      }

      const data = await response.json();
      setServiceData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching service details:", err);
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    if (!serviceId) return;

    fetchServiceDetails();

    // Setup socket for real-time updates
    const socket = io(SOCKET_URL);

    // Join both dashboard and service-specific rooms
    socket.emit("joinDashboard");
    socket.emit("joinService", serviceId);

    const handleUpdate = () => {
      fetchServiceDetails();
    };

    // Listen to multiple events for comprehensive real-time updates
    socket.on("dashboardUpdate", handleUpdate);
    socket.on("activityUpdate", handleUpdate);
    socket.on("queueUpdated", handleUpdate);
    socket.on("queueCalled", handleUpdate);

    return () => {
      socket.off("dashboardUpdate", handleUpdate);
      socket.off("activityUpdate", handleUpdate);
      socket.off("queueUpdated", handleUpdate);
      socket.off("queueCalled", handleUpdate);
      socket.emit("leaveDashboard");
      socket.emit("leaveService", serviceId);
      socket.disconnect();
    };
  }, [serviceId, fetchServiceDetails]);

  const startMonitoring = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/monitoring/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ serviceId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to start monitoring");
      }

      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const stopMonitoring = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/monitoring/stop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ serviceId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to stop monitoring");
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const callNextPatient = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/queue/call-next`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ serviceId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to call next patient");
      }

      await fetchServiceDetails();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const markAsServed = async (queueId) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/queue/mark-served/${queueId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to mark as served");
      }

      await fetchServiceDetails();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const skipPatient = async (queueId) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/queue/skip/${queueId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to skip patient");
      }

      await fetchServiceDetails();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const recallPatient = async (queueId) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/queue/recall/${queueId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to recall patient");
      }

      await fetchServiceDetails();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const removePatient = async (queueId) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/queue/remove/${queueId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to remove patient");
      }

      await fetchServiceDetails();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    serviceData,
    loading,
    error,
    startMonitoring,
    stopMonitoring,
    callNextPatient,
    markAsServed,
    skipPatient,
    recallPatient,
    removePatient,
    refetch: fetchServiceDetails,
  };
};
