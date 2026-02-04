import { useState, useEffect } from "react";
import { getToken } from "../../utils/session";

const API_URL = import.meta.env.VITE_API_URL;

export const useMedicalRecords = (patientId) => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (patientId) {
      fetchMedicalRecords(patientId);
    } else {
      setMedicalRecords([]);
    }
  }, [patientId]);

  const fetchMedicalRecords = async (patientId) => {
    setLoadingRecords(true);
    setError(null);
    try {
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
      setMedicalRecords(data.records || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching medical records:", err);
    } finally {
      setLoadingRecords(false);
    }
  };

  const saveMedicalRecord = async (queueId, medicalRecordData) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/medical-records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...medicalRecordData,
          queueId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save medical record");
      }

      const data = await response.json();

      // Refresh records after saving
      if (medicalRecordData.patient) {
        await fetchMedicalRecords(medicalRecordData.patient);
      }

      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    medicalRecords,
    loadingRecords,
    error,
    fetchMedicalRecords,
    saveMedicalRecord,
  };
};
