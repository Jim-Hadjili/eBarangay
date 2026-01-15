import { jwtDecode } from "jwt-decode";

export function getToken() {
  return localStorage.getItem("token");
}

export function isTokenValid(token) {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function getUserFromToken(token) {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

export function clearToken() {
  localStorage.removeItem("token");
}
