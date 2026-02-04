import { useState } from "react";

export const usePasswordValidation = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordSectionOpen, setIsPasswordSectionOpen] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPasswordError("");
  };

  const togglePasswordSection = () => {
    setIsPasswordSectionOpen(!isPasswordSectionOpen);
    if (!isPasswordSectionOpen) {
      resetPasswordFields();
    }
  };

  const resetPasswordFields = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
  };

  const validatePassword = () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    // If any password field has content, validate all of them
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword) {
        setPasswordError("Current password is required");
        return false;
      }
      if (!newPassword) {
        setPasswordError("New password is required");
        return false;
      }
      if (newPassword.length < 6) {
        setPasswordError("New password must be at least 6 characters long");
        return false;
      }
      if (newPassword !== confirmPassword) {
        setPasswordError("New passwords do not match");
        return false;
      }
    }

    return true;
  };

  const hasPasswordData = () => {
    return passwordData.currentPassword && passwordData.newPassword;
  };

  return {
    passwordData,
    passwordError,
    isPasswordSectionOpen,
    handlePasswordChange,
    togglePasswordSection,
    resetPasswordFields,
    validatePassword,
    hasPasswordData,
    setPasswordError,
  };
};
