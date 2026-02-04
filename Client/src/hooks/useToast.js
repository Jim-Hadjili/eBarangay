import { useState } from "react";

export const useToast = () => {
  const [toast, setToast] = useState({
    show: false,
    title: "",
    message: "",
    type: "success",
  });

  const showToast = (title, message = "", type = "success") => {
    setToast({ show: true, title, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, title: "", message: "", type: "success" });
  };

  return {
    toast,
    showToast,
    hideToast,
  };
};
