import { useState, useEffect } from "react";

export const useEditProfileForm = (user) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        dateOfBirth: user.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString().split("T")[0]
          : "",
        gender: user.gender || "",
        phone: user.phone || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const buildFormData = (profileImage, passwordData, hasPasswordData) => {
    const formDataToSend = new FormData();

    // Append all form fields
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Append password fields if provided
    if (hasPasswordData) {
      formDataToSend.append("currentPassword", passwordData.currentPassword);
      formDataToSend.append("newPassword", passwordData.newPassword);
    }

    // Append image if selected
    if (profileImage) {
      formDataToSend.append("profileImage", profileImage);
    }

    return formDataToSend;
  };

  return {
    formData,
    isSubmitting,
    setIsSubmitting,
    handleInputChange,
    buildFormData,
  };
};
