import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/ui/Header";
import {
  getToken,
  isTokenValid,
  getUserFromToken,
  clearToken,
} from "../utils/session";
import ContentTabs from "../sections/adminDashboard/TabsButton";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!isTokenValid(token)) {
      clearToken();
      navigate("/SignIn");
      return;
    }
    const userData = getUserFromToken(token);

    // Check if user is actually an admin
    if (userData?.userType !== "Admin") {
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
    // TODO: Implement edit profile functionality
    console.log("Edit profile clicked");
  };

  return (
    <>
      <Header
        user={user}
        onLogout={handleLogout}
        onEditProfile={handleEditProfile}
      />
      <ContentTabs />
    </>
  );
}
