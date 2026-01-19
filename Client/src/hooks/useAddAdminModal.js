import { useState } from "react";
import { getToken } from "../utils/session";

export function useAddAdminModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    dateOfBirth: "",
    gender: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      setError("All required fields must be filled");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = getToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/add-admin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone || null,
            password: formData.password,
            dateOfBirth: formData.dateOfBirth || null,
            gender: formData.gender || null,
            address: formData.address || null,
            userType: "Admin", // Automatically set to Admin
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create admin user");
      }

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        dateOfBirth: "",
        gender: "",
        address: "",
      });

      // Call success callback
      if (onSuccess) {
        onSuccess(`${formData.firstName} ${formData.lastName}`);
      }

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        dateOfBirth: "",
        gender: "",
        address: "",
      });
      setError("");
      onClose();
    }
  };

  return {
    formData,
    loading,
    error,
    handleChange,
    handleSubmit,
    handleClose,
  };
}
