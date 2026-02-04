import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getToken,
  isTokenValid,
  getUserFromToken,
  clearToken,
  setToken,
} from "../utils/session";

export default function useQueueHistoryPage() {
  const [user, setUser] = useState(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!isTokenValid(token)) {
      clearToken();
      navigate("/SignIn");
      return;
    }
    const userData = getUserFromToken(token);

    if (userData?.userType === "Admin") {
      navigate("/AdminDashboard");
      return;
    }

    setUser(userData);
  }, [navigate]);

  const handleLogout = () => {
    clearToken();
    setUser(null);
    navigate("/SignIn");
  };

  const handleEditProfile = () => {
    setIsEditProfileOpen(true);
  };

  const handleQueueHistory = () => {
    // Already on queue history page
  };

  const handleBackToDashboard = () => {
    navigate("/PatientDashboard");
  };

  const handleBrowseServices = () => {
    navigate("/PatientDashboard");
  };

  const updateUserProfile = (newToken) => {
    setToken(newToken);
    setUser(getUserFromToken(newToken));
    setIsEditProfileOpen(false);
  };

  return {
    user,
    isEditProfileOpen,
    setIsEditProfileOpen,
    handleLogout,
    handleEditProfile,
    handleQueueHistory,
    handleBackToDashboard,
    handleBrowseServices,
    updateUserProfile,
  };
}
