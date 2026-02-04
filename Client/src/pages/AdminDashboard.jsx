import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/ui/Header";
import {
  getToken,
  isTokenValid,
  getUserFromToken,
  clearToken,
  setToken,
} from "../utils/session";
import ContentTabs from "../sections/adminDashboard/TabsButton";
import EditProfileModal from "../components/modals/EditProfileModal";
import useEditProfile from "../hooks/useEditProfile";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { updateProfile } = useEditProfile();

  useEffect(() => {
    const token = getToken();
    if (!isTokenValid(token)) {
      clearToken();
      navigate("/SignIn");
      return;
    }
    const userData = getUserFromToken(token);

    // Check if user is actually an admin
    if (
      userData?.userType !== "Admin" &&
      userData?.userType !== "Super Admin"
    ) {
      clearToken();
      navigate("/SignIn");
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

  const handleSaveProfile = async (formData) => {
    try {
      const response = await updateProfile(formData);
      // Update token with new user data
      setToken(response.token);
      // Update local user state
      setUser(getUserFromToken(response.token));
      setIsEditProfileOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <>
      <Header
        user={user}
        onLogout={handleLogout}
        onEditProfile={handleEditProfile}
      />
      <ContentTabs />
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />
    </>
  );
}
