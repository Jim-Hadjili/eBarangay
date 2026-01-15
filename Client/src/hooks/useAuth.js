import { useState, useEffect } from "react";
import { getToken, getUserFromToken } from "../utils/session";

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setUser(getUserFromToken(token));
    }
  }, []);

  const getFullName = () => {
    if (!user) return "";
    return `${user.firstName || ""} ${user.lastName || ""}`.trim();
  };

  return { user, getFullName };
};
