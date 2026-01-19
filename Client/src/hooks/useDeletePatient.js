import { useState } from "react";
import { getToken } from "../utils/session";

export function useDeletePatient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deletePatient = async (userId) => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/delete-patient/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete patient");
      }

      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return { deletePatient, loading, error };
}
