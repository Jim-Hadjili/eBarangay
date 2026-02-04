import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatientMedicalRecords } from "./usePatientMedicalRecords";
import useEditProfile from "./useEditProfile";
import {
  getToken,
  isTokenValid,
  getUserFromToken,
  clearToken,
  setToken,
} from "../utils/session";

export const useMedicalHistory = () => {
  const [user, setUser] = useState(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const navigate = useNavigate();
  const { records, loading, error, fetchRecords } = usePatientMedicalRecords();
  const { updateProfile } = useEditProfile();

  // Authenticate and fetch records
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

    // Fetch medical records for this patient
    if (userData?.id) {
      fetchRecords(userData.id);
    }
  }, [navigate, fetchRecords]);

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
    navigate("/PatientDashboard");
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

  // Retry handler
  const handleRetry = () => {
    if (user?.id) {
      fetchRecords(user.id);
    }
  };

  // Pagination
  const totalPages = Math.ceil(records.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRecords = records.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset to page 1 when records change
  useEffect(() => {
    setCurrentPage(1);
  }, [records.length]);

  return {
    user,
    records: paginatedRecords,
    totalRecords: records.length,
    loading,
    error,
    isEditProfileOpen,
    currentPage,
    totalPages,
    itemsPerPage,
    handleLogout,
    handleEditProfile,
    handleQueueHistory,
    handleBack,
    handleSaveProfile,
    handleCloseEditProfile,
    handleRetry,
    handlePageChange,
  };
};
