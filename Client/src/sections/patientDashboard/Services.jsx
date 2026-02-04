import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useSocket } from "../../hooks/useSocket";
import { useServices } from "../../hooks/useServices";
import { useQueue } from "../../hooks/useQueue";
import ServicesList from "../../components/patientDashboard/ServicesList";
import QueueCard from "../../components/patientDashboard/QueueCard";
import QueueInfoModal from "../../components/patientDashboard/QueueInfoModal";
import YourTurnModal from "../../components/patientDashboard/YourTurnModal";
import SkippedModal from "../../components/patientDashboard/SkippedModal";
import CancelQueueModal from "../../components/modals/CancelQueueModal";
import NotificationModal from "../../components/modals/NotificationModal";
import LoadingModal from "../../components/modals/LoadingModal";
import ViewMedicalRecordsButton from "../../components/patientDashboard/ViewMedicalRecordsButton";

export default function Services() {
  const { getFullName } = useAuth();
  const { services, loading } = useServices();

  const {
    notificationModalOpen,
    setNotificationModalOpen,
    skippedModalOpen,
    setSkippedModalOpen,
    joinQueueRoom,
    leaveQueueRoom,
  } = useSocket();

  const {
    userQueue,
    selectedService,
    queueData,
    fetchQueueForService,
    joinQueue,
    cancelQueue,
  } = useQueue(joinQueueRoom);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [openingServiceLoading, setOpeningServiceLoading] = useState(false); // New state
  const [joiningQueue, setJoiningQueue] = useState(false);
  const [cancellingQueue, setCancellingQueue] = useState(false); // Add this state
  const [notification, setNotification] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const handleServiceClick = async (service) => {
    setOpeningServiceLoading(true);
    await fetchQueueForService(service);
    setOpeningServiceLoading(false);
    setModalOpen(true);
  };

  const handleJoinQueue = async () => {
    setJoiningQueue(true);
    const result = await joinQueue(selectedService._id);
    setJoiningQueue(false);

    if (result.success) {
      setNotification({
        open: true,
        type: "success",
        title: "Joined Queue Successfully",
        message: `Your queue number is ${result.data.queue.queueCode}`,
      });
      setModalOpen(false);
    } else {
      setNotification({
        open: true,
        type: "error",
        title: "Failed to Join Queue",
        message: result.message,
      });
    }
  };

  const handleCancelQueue = async () => {
    setCancellingQueue(true);
    const result = await cancelQueue(leaveQueueRoom);
    setCancellingQueue(false);
    if (result.success) {
      setNotification({
        open: true,
        type: "success",
        title: "Queue Cancelled",
        message: `Queue canceled successfully.`,
      });
      setCancelModalOpen(false);
    } else {
      setNotification({
        open: true,
        type: "error",
        title: "Failed to Cancel Queue",
        message: result.message,
      });
    }
  };

  const handleRefreshQueue = async () => {
    if (!userQueue) {
      return;
    }

    setRefreshLoading(true);

    const service = services.find((s) => s.name === userQueue.serviceName);

    if (service) {
      await fetchQueueForService(service);
    }

    setRefreshLoading(false);
  };

  return (
    <section className="w-full px-6 py-3 md:px-8 lg:px-20 lg:py-10">
      <div>
        <h1 className="font-Lexend text-3xl">Welcome back, {getFullName()}!</h1>
        <p>Manage Your Healthcare Appointment and Queue Status</p>
      </div>
      <div className="mt-8 flex flex-col lg:flex-row gap-8">
        <div className="flex flex-col flex-1">
          <ServicesList
            services={services}
            loading={loading}
            selectedService={selectedService}
            onServiceClick={handleServiceClick}
          />
        </div>
        <div className="flex flex-col items-stretch">
          <QueueCard
            userQueue={userQueue}
            onCancel={() => setCancelModalOpen(true)}
            onRefresh={handleRefreshQueue}
          />
          <ViewMedicalRecordsButton />
        </div>
      </div>
      <QueueInfoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedService={selectedService}
        userQueue={userQueue}
        queueData={queueData}
        onJoinQueue={handleJoinQueue}
        isJoining={joiningQueue} // Pass the loading state
      />
      <CancelQueueModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancelQueue}
        queueInfo={userQueue}
        isCancelling={cancellingQueue} // Pass the loading state
      />
      <YourTurnModal
        isOpen={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
        userQueue={userQueue}
      />
      <SkippedModal
        isOpen={skippedModalOpen}
        onClose={() => setSkippedModalOpen(false)}
        queueInfo={userQueue}
      />
      <LoadingModal
        isOpen={openingServiceLoading}
        message="Opening services please wait"
      />
      <LoadingModal isOpen={refreshLoading} message="Refreshing Queue" />
      <NotificationModal
        isOpen={notification.open}
        onClose={() => setNotification((n) => ({ ...n, open: false }))}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
    </section>
  );
}
