import { useState } from "react";

export const useQueueControl = (
  serviceData,
  stopMonitoring,
  callNextPatient,
  markAsServed,
  skipPatient,
) => {
  const [showStopModal, setShowStopModal] = useState(false);
  const [showMedicalRecordModal, setShowMedicalRecordModal] = useState(false);
  const [showViewRecordModal, setShowViewRecordModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isStoppingMonitoring, setIsStoppingMonitoring] = useState(false);
  const [isSavingMedicalRecord, setIsSavingMedicalRecord] = useState(false);

  const currentQueue = serviceData?.currentQueue;
  const patient = currentQueue?.patient;
  const waitingQueues =
    serviceData?.queues?.filter((queue) => queue._id !== currentQueue?._id) ||
    [];

  const handleBack = () => {
    setShowStopModal(true);
  };

  const handleStopMonitoring = async () => {
    setIsStoppingMonitoring(true);
    const result = await stopMonitoring();
    setIsStoppingMonitoring(false);
    return result;
  };

  const handleCallClick = async () => {
    return await callNextPatient();
  };

  const handleSkipClick = async () => {
    if (!currentQueue?._id) {
      return { success: false, error: "No patient to skip" };
    }
    return await skipPatient(currentQueue._id);
  };

  const handleCompleteClick = () => {
    setShowMedicalRecordModal(true);
  };

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setShowViewRecordModal(true);
  };

  const handleCloseMedicalRecordModal = () => {
    setShowMedicalRecordModal(false);
  };

  const handleCloseViewRecordModal = () => {
    setShowViewRecordModal(false);
    setSelectedRecord(null);
  };

  return {
    // State
    showStopModal,
    showMedicalRecordModal,
    showViewRecordModal,
    selectedRecord,
    isStoppingMonitoring,
    isSavingMedicalRecord,
    currentQueue,
    patient,
    waitingQueues,
    // Actions
    setShowStopModal,
    setIsSavingMedicalRecord,
    handleBack,
    handleStopMonitoring,
    handleCallClick,
    handleSkipClick,
    handleCompleteClick,
    handleViewRecord,
    handleCloseMedicalRecordModal,
    handleCloseViewRecordModal,
  };
};
