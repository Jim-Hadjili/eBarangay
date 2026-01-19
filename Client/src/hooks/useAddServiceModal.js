import { useState } from "react";

export function useAddServiceModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    identifier: "",
    name: "",
    description: "",
    queueLimit: "",
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
    if (!formData.identifier || !formData.name || !formData.description) {
      setError("All fields except queue limit are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          identifier: formData.identifier,
          name: formData.name,
          description: formData.description,
          queueLimit: formData.queueLimit
            ? parseInt(formData.queueLimit)
            : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create service");
      }

      // Reset form
      setFormData({
        identifier: "",
        name: "",
        description: "",
        queueLimit: "",
      });

      // Call success callback with service name
      if (onSuccess) {
        onSuccess(formData.name);
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
        identifier: "",
        name: "",
        description: "",
        queueLimit: "",
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
