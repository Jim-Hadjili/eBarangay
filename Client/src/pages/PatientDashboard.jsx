import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../sections/patientDashboard/Header.jsx";
import Services from "../sections/patientDashboard/Services";
import {
  getToken,
  isTokenValid,
  getUserFromToken,
  clearToken,
} from "../utils/session";

export default function PatientDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!isTokenValid(token)) {
      clearToken();
      navigate("/");
      return;
    }
    setUser(getUserFromToken(token));
  }, [navigate]);

  const handleLogout = () => {
    clearToken();
    setUser(null);
    navigate("/");
  };

  return (
    <>
      <Header />
      <Services />
    </>
  );
}
