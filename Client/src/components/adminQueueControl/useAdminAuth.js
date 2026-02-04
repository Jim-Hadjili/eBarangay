import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, isTokenValid, getUserFromToken } from "../../utils/session";

export const useAdminAuth = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();

    if (!isTokenValid(token)) {
      navigate("/auth", { replace: true });
      return;
    }

    const userData = getUserFromToken(token);

    if (
      userData?.userType !== "Admin" &&
      userData?.userType !== "Super Admin"
    ) {
      navigate("/", { replace: true });
      return;
    }

    setUser(userData);
  }, [navigate]);

  return { user };
};
