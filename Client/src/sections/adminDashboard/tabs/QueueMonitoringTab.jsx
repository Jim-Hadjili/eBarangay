import { AlertCircle } from "lucide-react";
import { useQueueMonitoringTab } from "../../../hooks/useQueueMonitoringTab";
import MonitoringConfirmModal from "../../../components/modals/MonitoringConfirmModal";
import ServiceAlreadyMonitoredModal from "../../../components/modals/ServiceAlreadyMonitoredModal";
import AlreadyMonitoringModal from "../../../components/modals/AlreadyMonitoringModal";
import Toast from "../../../components/ui/Toast";
import QueueMonitoringHeader from "../../../components/adminDashboard/queueTab/QueueMonitoringHeader";
import ServiceQueueCard from "../../../components/adminDashboard/queueTab/ServiceQueueCard";
import NoActiveQueues from "../../../components/adminDashboard/queueTab/NoActiveQueues";

export default function QueueMonitoringTab() {
  const {
    services,
    loading,
    error,
    selectedService,
    setSelectedService,
    showMonitoringModal,
    setShowMonitoringModal,
    showAlreadyMonitoredModal,
    setShowAlreadyMonitoredModal,
    showAlreadyMonitoringModal,
    setShowAlreadyMonitoringModal,
    currentMonitoringService,
    setCurrentMonitoringService,
    monitoredByName,
    setMonitoredByName,
    isStartingMonitoring,
    handleServiceClick,
    handleStartMonitoring,
    toast,
    setToast,
  } = useQueueMonitoringTab();

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center w-full h-screen">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
            <p className="text-gray-600 font-Lexend">Loading Queue List...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="w-full px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-16 lg:py-12 xl:px-20">
          <QueueMonitoringHeader />
          <div className="p-6 text-center bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 text-red-500" />
            <p className="text-sm text-red-600 font-Lexend">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const activeServices = services.filter((s) => s.waitingCount > 0);
  const hasActiveQueues = activeServices.length > 0;

  console.log("QueueMonitoringTab Debug:", {
    servicesCount: services.length,
    activeServicesCount: activeServices.length,
    services: services.map((s) => ({
      name: s.name,
      waitingCount: s.waitingCount,
    })),
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-16 lg:py-12 xl:px-20">
        <QueueMonitoringHeader />
        {!hasActiveQueues ? (
          <NoActiveQueues />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeServices.map((service) => (
              <ServiceQueueCard
                key={service._id}
                service={service}
                onClick={() => handleServiceClick(service)}
              />
            ))}
          </div>
        )}
      </div>
      <MonitoringConfirmModal
        isOpen={showMonitoringModal}
        onClose={() => {
          setShowMonitoringModal(false);
          setSelectedService(null);
        }}
        onConfirm={handleStartMonitoring}
        service={selectedService}
        isLoading={isStartingMonitoring}
      />
      <ServiceAlreadyMonitoredModal
        isOpen={showAlreadyMonitoredModal}
        onClose={() => {
          setShowAlreadyMonitoredModal(false);
          setSelectedService(null);
          setMonitoredByName("");
        }}
        serviceName={selectedService?.name}
        monitoredBy={monitoredByName}
      />
      <AlreadyMonitoringModal
        isOpen={showAlreadyMonitoringModal}
        onClose={() => {
          setShowAlreadyMonitoringModal(false);
          setSelectedService(null);
          setCurrentMonitoringService(null);
        }}
        currentService={currentMonitoringService}
      />
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() =>
            setToast({ show: false, message: "", type: "success" })
          }
        />
      )}
    </div>
  );
}
