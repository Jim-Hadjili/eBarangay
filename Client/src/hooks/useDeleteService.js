import { useState } from "react";

export function useDeleteService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deleteService = async (serviceId) => {
    setLoading(true);
    setError("");

    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/services/${serviceId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete service");
      }

      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { deleteService, loading, error };
}
