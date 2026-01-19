import { useState } from "react";

export function useUpdateService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateService = async (serviceId, updatedData) => {
    setLoading(true);
    setError("");

    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/services/${serviceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update service");
      }

      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { updateService, loading, error };
}
