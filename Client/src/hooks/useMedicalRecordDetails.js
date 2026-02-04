import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePatientMedicalRecords } from "./usePatientMedicalRecords";
import useEditProfile from "./useEditProfile";
import {
  getToken,
  isTokenValid,
  getUserFromToken,
  clearToken,
  setToken,
} from "../utils/session";

export const useMedicalRecordDetails = () => {
  const [user, setUser] = useState(null);
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { recordId } = useParams();
  const { fetchSingleRecord } = usePatientMedicalRecords();
  const { updateProfile } = useEditProfile();

  // Authenticate user
  useEffect(() => {
    const token = getToken();
    if (!isTokenValid(token)) {
      clearToken();
      navigate("/SignIn");
      return;
    }
    const userData = getUserFromToken(token);

    // Check if user is a patient (not admin)
    if (userData?.userType === "Admin") {
      navigate("/AdminDashboard");
      return;
    }

    setUser(userData);
  }, [navigate]);

  // Fetch medical record
  useEffect(() => {
    const loadRecord = async () => {
      if (!recordId) {
        navigate("/medical-history");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await fetchSingleRecord(recordId);
        setRecord(data);
      } catch (err) {
        setError(err.message || "Failed to load medical record");
        console.error("Error loading medical record:", err);
      } finally {
        setLoading(false);
      }
    };

    loadRecord();
  }, [recordId, fetchSingleRecord, navigate]);

  // Navigation handlers
  const handleLogout = () => {
    clearToken();
    setUser(null);
    navigate("/SignIn");
  };

  const handleEditProfile = () => {
    setIsEditProfileOpen(true);
  };

  const handleQueueHistory = () => {
    navigate("/queue-history");
  };

  const handleBack = () => {
    navigate("/medical-history");
  };

  // Profile handlers
  const handleSaveProfile = async (formData) => {
    try {
      const response = await updateProfile(formData);
      setToken(response.token);
      setUser(getUserFromToken(response.token));
      setIsEditProfileOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCloseEditProfile = () => {
    setIsEditProfileOpen(false);
  };

  return {
    user,
    record,
    loading,
    error,
    isEditProfileOpen,
    handleLogout,
    handleEditProfile,
    handleQueueHistory,
    handleBack,
    handleSaveProfile,
    handleCloseEditProfile,
  };
};
