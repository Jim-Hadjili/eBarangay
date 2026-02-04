import { useState } from "react";
import { useAdminUsers } from "./useAdminUsers";
import { getToken, getUserFromToken } from "../utils/session";

export function useAdminUsersTab() {
  const { adminUsers, loading, error, refetch } = useAdminUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileModal, setProfileModal] = useState({
    isOpen: false,
    admin: null,
  });
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Get current user from token
  const token = getToken();
  const currentUser = getUserFromToken(token);

  const handleAddSuccess = (userName) => {
    setToast({
      show: true,
      message: `${userName} has been added successfully!`,
      type: "success",
    });
    refetch();
  };

  const handleDeleteSuccess = (userName) => {
    setToast({
      show: true,
      message: `${userName} has been deleted successfully!`,
      type: "success",
    });
    refetch();
  };

  // Filter admin users based on search query
  const filteredAdminUsers = adminUsers.filter((admin) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      admin.name.toLowerCase().includes(searchLower) ||
      admin.email.toLowerCase().includes(searchLower) ||
      admin.role.toLowerCase().includes(searchLower) ||
      (admin.phone && admin.phone.toLowerCase().includes(searchLower))
    );
  });

  const handleCloseToast = () => setToast((prev) => ({ ...prev, show: false }));

  const handleProfileClick = (admin) => {
    setProfileModal({ isOpen: true, admin });
  };

  const handleCloseProfile = () => {
    setProfileModal({ isOpen: false, admin: null });
  };

  return {
    adminUsers,
    loading,
    error,
    isModalOpen,
    setIsModalOpen,
    searchQuery,
    setSearchQuery,
    toast,
    handleCloseToast,
    handleAddSuccess,
    handleDeleteSuccess,
    filteredAdminUsers,
    currentUser,
    profileModal,
    handleProfileClick,
    handleCloseProfile,
  };
}
