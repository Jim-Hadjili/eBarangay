import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "");

export const useProfileImage = (user) => {
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (user?.profileImage) {
      setImagePreview(`${API_BASE_URL}${user.profileImage}`);
    } else {
      setImagePreview(null);
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetImage = () => {
    setProfileImage(null);
    setImagePreview(
      user?.profileImage ? `${API_BASE_URL}${user.profileImage}` : null,
    );
  };

  return {
    profileImage,
    imagePreview,
    handleImageChange,
    resetImage,
  };
};
