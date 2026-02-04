import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueueMonitoring } from "./useQueueMonitoring";
import { getToken, getUserFromToken } from "../utils/session";

export function useQueueMonitoringTab() {
  const { services, loading, error } = useQueueMonitoring();
  const [selectedService, setSelectedService] = useState(null);
  const [showMonitoringModal, setShowMonitoringModal] = useState(false);
  const [showAlreadyMonitoredModal, setShowAlreadyMonitoredModal] =
    useState(false);
  const [showAlreadyMonitoringModal, setShowAlreadyMonitoringModal] =
    useState(false);
  const [currentMonitoringService, setCurrentMonitoringService] =
    useState(null);
  const [monitoredByName, setMonitoredByName] = useState("");
  const [isStartingMonitoring, setIsStartingMonitoring] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const navigate = useNavigate();

  const handleServiceClick = (service) => {
    const token = getToken();
    const user = getUserFromToken(token);
    if (service.isMonitored && service.monitoredBy) {
      const currentUserFullName = `${user.firstName} ${user.lastName}`;
      if (service.monitoredBy === currentUserFullName) {
        navigate("/AdminQueueControl", {
          state: { serviceId: service._id, serviceName: service.name },
        });
        return;
      }
      setSelectedService(service);
      setMonitoredByName(service.monitoredBy);
      setShowAlreadyMonitoredModal(true);
      return;
    }
    setSelectedService(service);
    setShowMonitoringModal(true);
  };

  const handleStartMonitoring = async () => {
    setIsStartingMonitoring(true);
    try {
      const token = getToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/monitoring/start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ serviceId: selectedService._id }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 409) {
          // Check if admin is already monitoring another service
          if (data.currentService) {
            setCurrentMonitoringService(data.currentService);
            setShowMonitoringModal(false);
            setShowAlreadyMonitoringModal(true);
          } else {
            // Service is being monitored by another admin
            setMonitoredByName(data.monitoredBy);
            setShowMonitoringModal(false);
            setShowAlreadyMonitoredModal(true);
          }
        } else {
          throw new Error(data.message || "Failed to start monitoring");
        }
        setIsStartingMonitoring(false);
        return;
      }
      setShowMonitoringModal(false);
      navigate("/AdminQueueControl", {
        state: {
          serviceId: selectedService._id,
          serviceName: selectedService.name,
        },
      });
    } catch (err) {
      showToast(err.message || "Failed to start monitoring", "error");
      setIsStartingMonitoring(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000,
    );
  };

  return {
    services,
    showAlreadyMonitoringModal,
    setShowAlreadyMonitoringModal,
    currentMonitoringService,
    setCurrentMonitoringService,
    loading,
    error,
    selectedService,
    setSelectedService,
    showMonitoringModal,
    setShowMonitoringModal,
    showAlreadyMonitoredModal,
    setShowAlreadyMonitoredModal,
    monitoredByName,
    setMonitoredByName,
    isStartingMonitoring,
    handleServiceClick,
    handleStartMonitoring,
    toast,
    setToast,
    showToast,
  };
}
