import { useNavigate, useLocation } from "react-router-dom";
import { useMonitoring } from "../hooks/useMonitoring";
import { useMedicalRecords } from "../components/adminQueueControl/useMedicalRecords";
import { useQueueControl } from "../components/adminQueueControl/useQueueControl";
import { useToast } from "../components/adminQueueControl/useToast";
import { useAdminAuth } from "../components/adminQueueControl/useAdminAuth";
import QueueControlHeader from "../components/adminQueueControl/QueueControlHeader";
import NowServingCard from "../components/adminQueueControl/NowServingCard";
import WaitingQueueCard from "../components/adminQueueControl/WaitingQueueCard";
import MedicalRecordsPanel from "../components/adminQueueControl/MedicalRecordsPanel";
import LoadingState from "../components/adminQueueControl/LoadingState";
import ErrorState from "../components/adminQueueControl/ErrorState";
import StopMonitoringModal from "../components/modals/StopMonitoringModal";
import MedicalRecordModal from "../components/modals/MedicalRecordModal";
import ViewMedicalRecordModal from "../components/modals/ViewMedicalRecordModal";
import Toast from "../components/ui/Toast";

export default function AdminQueueControl() {
  const navigate = useNavigate();
  const location = useLocation();
  const serviceId = location.state?.serviceId;
  const serviceName = location.state?.serviceName;

  // Authentication
  const { user } = useAdminAuth();

  // Service monitoring
  const {
    serviceData,
    loading,
    error,
    stopMonitoring,
    callNextPatient,
    markAsServed,
    skipPatient,
    recallPatient,
    removePatient,
  } = useMonitoring(serviceId);

  // Queue control state and handlers
  const {
    showStopModal,
    showMedicalRecordModal,
    showViewRecordModal,
    selectedRecord,
    isStoppingMonitoring,
    isSavingMedicalRecord,
    currentQueue,
    patient,
    waitingQueues,
    setShowStopModal,
    setIsSavingMedicalRecord,
    handleBack,
    handleStopMonitoring,
    handleCallClick,
    handleCompleteClick,
    handleSkipClick,
    handleViewRecord,
    handleCloseMedicalRecordModal,
    handleCloseViewRecordModal,
  } = useQueueControl(
    serviceData,
    stopMonitoring,
    callNextPatient,
    markAsServed,
    skipPatient,
  );

  // Medical records
  const { medicalRecords, loadingRecords, saveMedicalRecord } =
    useMedicalRecords(patient?._id);

  // Toast notifications
  const { toast, showToast, hideToast } = useToast();

  // Validate serviceId on mount
  if (!serviceId && !loading) {
    navigate("/AdminDashboard");
    return null;
  }

  const handleStopMonitoringConfirm = async () => {
    const result = await handleStopMonitoring();
    if (result.success) {
      navigate("/AdminDashboard");
    } else {
      showToast(result.error || "Failed to stop monitoring", "error");
    }
  };

  const handleCallPatient = async () => {
    const result = await handleCallClick();
    if (result.success) {
      showToast("Patient called successfully");
    } else {
      showToast(result.error || "Failed to call patient", "error");
    }
  };

  const handleSkipPatient = async () => {
    const result = await handleSkipClick();
    if (result.success) {
      showToast("Patient skipped and moved to recall list");
    } else {
      showToast(result.error || "Failed to skip patient", "error");
    }
  };

  const handleRecallPatient = async (queueId) => {
    const result = await recallPatient(queueId);
    if (result.success) {
      showToast("Patient recalled successfully");
    } else {
      showToast(result.error || "Failed to recall patient", "error");
    }
  };

  const handleRemovePatient = async (queueId) => {
    const result = await removePatient(queueId);
    if (result.success) {
      showToast("Patient removed from recall list");
    } else {
      showToast(result.error || "Failed to remove patient", "error");
    }
  };

  const handleMedicalRecordSubmit = async (medicalRecordData) => {
    if (!currentQueue?._id) {
      showToast("No active queue found", "error");
      return;
    }

    setIsSavingMedicalRecord(true);

    const result = await saveMedicalRecord(currentQueue._id, medicalRecordData);

    if (result.success) {
      showToast("Medical record saved successfully");

      const markResult = await markAsServed(currentQueue._id);

      if (markResult.success) {
        showToast("Patient marked as served successfully");
        handleCloseMedicalRecordModal();
      } else {
        showToast(
          markResult.error ||
            "Medical record saved but failed to mark as served",
          "error",
        );
      }
    } else {
      showToast(result.error || "Failed to save medical record", "error");
    }

    setIsSavingMedicalRecord(false);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        onBackToDashboard={() => navigate("/AdminDashboard")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <QueueControlHeader
        serviceName={serviceData?.service?.name || serviceName}
        onBack={handleBack}
      />

      <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 sm:py-6 lg:px-8">
        <div className="grid gap-4 sm:gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
          {/* Left Side - Queue Control */}
          <div className="space-y-4 sm:space-y-6">
            <NowServingCard
              currentQueue={currentQueue}
              patient={patient}
              onCallClick={handleCallPatient}
              onCompleteClick={handleCompleteClick}
              onSkipClick={handleSkipPatient}
            />
            <WaitingQueueCard
              waitingQueues={waitingQueues}
              skippedQueues={serviceData?.skippedQueues || []}
              onRecallPatient={handleRecallPatient}
              onRemovePatient={handleRemovePatient}
            />
          </div>

          {/* Right Side - Medical Records */}
          <MedicalRecordsPanel
            patient={patient}
            medicalRecords={medicalRecords}
            loadingRecords={loadingRecords}
            onViewRecord={handleViewRecord}
          />
        </div>
      </div>

      {/* Modals */}
      <StopMonitoringModal
        isOpen={showStopModal}
        onClose={() => setShowStopModal(false)}
        onConfirm={handleStopMonitoringConfirm}
        serviceName={serviceData?.service?.name || serviceName}
        isLoading={isStoppingMonitoring}
      />

      <MedicalRecordModal
        isOpen={showMedicalRecordModal}
        onClose={handleCloseMedicalRecordModal}
        onSubmit={handleMedicalRecordSubmit}
        patient={patient}
        isLoading={isSavingMedicalRecord}
        actionType="complete"
      />

      <ViewMedicalRecordModal
        isOpen={showViewRecordModal}
        onClose={handleCloseViewRecordModal}
        record={selectedRecord}
      />

      {/* Toast */}
      {toast.show && (
        <Toast
          isVisible={toast.show}
          title={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}
