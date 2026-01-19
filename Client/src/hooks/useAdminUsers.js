import { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import { getToken } from "../utils/session";

const SOCKET_URL = import.meta.env.VITE_API_URL.replace(/\/api$/, "");

export const useAdminUsers = () => {
  const [adminUsers, setAdminUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdminUsers = useCallback(async () => {
    try {
      const token = getToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/dashboard/admin-users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch admin users");
      }

      const data = await response.json();
      setAdminUsers(data.adminUsers || []);
      setError(null);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching admin users:", err);
      setAdminUsers([]);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchAdminUsers();

    // Setup socket connection for real-time updates
    const socket = io(SOCKET_URL);

    // Join dashboard room to receive updates
    socket.emit("joinDashboard");

    // Listen for dashboard updates
    const handleUpdate = () => {
      fetchAdminUsers();
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
  }, [fetchAdminUsers]);

  return { adminUsers, loading, error, refetch: fetchAdminUsers };
};
