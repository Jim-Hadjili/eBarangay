import { useState, useCallback } from "react";
import { getToken } from "../utils/session";

const API_URL = import.meta.env.VITE_API_URL;

export const usePatientMedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecords = useCallback(async (patientId) => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();

      const response = await fetch(
        `${API_URL}/medical-records/patient/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch medical records");
      }

      const data = await response.json();
      setRecords(data.records || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching medical records:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSingleRecord = useCallback(async (recordId) => {
    try {
      const token = getToken();

      const response = await fetch(`${API_URL}/medical-records/${recordId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch medical record");
      }

      const data = await response.json();
      return data.record;
    } catch (err) {
      console.error("Error fetching medical record:", err);
      throw err;
    }
  }, []);

  const createRecord = useCallback(async (recordData) => {
    try {
      const token = getToken();

      const response = await fetch(`${API_URL}/medical-records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recordData),
      });

      if (!response.ok) {
        throw new Error("Failed to create medical record");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error creating medical record:", err);
      throw err;
    }
  }, []);

  const updateRecord = useCallback(async (recordId, recordData) => {
    try {
      const token = getToken();

      const response = await fetch(`${API_URL}/medical-records/${recordId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recordData),
      });

      if (!response.ok) {
        throw new Error("Failed to update medical record");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error updating medical record:", err);
      throw err;
    }
  }, []);

  return {
    records,
    loading,
    error,
    fetchRecords,
    fetchSingleRecord,
    createRecord,
    updateRecord,
  };
};
