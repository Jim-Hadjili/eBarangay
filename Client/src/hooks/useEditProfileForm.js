import { useState, useEffect } from "react";

export const useEditProfileForm = (user) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    priorityStatus: "",
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
        address: user.address || "",
        priorityStatus: user.priorityStatus || "None",
      });
    }
  }, [user]);

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateSeniorCitizen = () => {
    if (formData.priorityStatus === "Senior Citizen") {
      if (!formData.dateOfBirth) {
        return "Date of birth is required for Senior Citizen status";
      }
      const age = calculateAge(formData.dateOfBirth);
      if (age < 60) {
        return "Senior Citizen status requires age 60 or above";
      }
    }
    return null;
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
    validateSeniorCitizen,
  };
};
