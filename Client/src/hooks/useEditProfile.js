import { useState } from "react";
import { getToken } from "../utils/session";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function useEditProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProfile = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getToken();
      const response = await axios.put(`${API_URL}/auth/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setIsLoading(false);
      return response.data;
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.message || "Failed to update profile");
      throw err;
    }
  };

  return {
    updateProfile,
    isLoading,
    error,
  };
}
