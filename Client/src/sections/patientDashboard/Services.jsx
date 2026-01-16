import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useSocket } from "../../hooks/useSocket";
import { useServices } from "../../hooks/useServices";
import { useQueue } from "../../hooks/useQueue";
import ServicesList from "../../components/patientDashboard/ServicesList";
import QueueCard from "../../components/patientDashboard/QueueCard";
import QueueInfoModal from "../../components/patientDashboard/QueueInfoModal";
import YourTurnModal from "../../components/patientDashboard/YourTurnModal";
import CancelQueueModal from "../../components/modals/CancelQueueModal";
import LoadingModal from "../../components/modals/LoadingModal"; // Add this import

export default function Services() {
  const { getFullName } = useAuth();
  const { services, loading } = useServices();

  const {
    notificationModalOpen,
    setNotificationModalOpen,
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
  const [refreshLoading, setRefreshLoading] = useState(false); // Add this state

  const handleServiceClick = async (service) => {
    await fetchQueueForService(service);
    setModalOpen(true);
  };

  const handleJoinQueue = async () => {
    const result = await joinQueue(selectedService._id);
    if (result.success) {
      alert(`Success! Your queue number is ${result.data.queue.queueCode}`);
      setModalOpen(false);
    } else {
      alert(result.message);
    }
  };

  const handleCancelQueue = async () => {
    const result = await cancelQueue(leaveQueueRoom);
    if (result.success) {
      alert(
        `Queue canceled successfully. ${result.data.reorderedCount} queue(s) were reordered.`
      );
      setCancelModalOpen(false);
    } else {
      alert(result.message);
    }
  };

  // Add this function inside the Services component
  const handleRefreshQueue = async () => {
    if (!userQueue) {
      return; // Don't do anything if no active queue
    }

    setRefreshLoading(true);

    // Find the service from the services list that matches the userQueue
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
        <ServicesList
          services={services}
          loading={loading}
          selectedService={selectedService}
          onServiceClick={handleServiceClick}
        />

        <QueueCard
          userQueue={userQueue}
          onCancel={() => setCancelModalOpen(true)}
          onRefresh={handleRefreshQueue}
        />
      </div>
      <QueueInfoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedService={selectedService}
        userQueue={userQueue}
        queueData={queueData}
        onJoinQueue={handleJoinQueue}
      />
      <CancelQueueModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancelQueue}
        queueInfo={userQueue}
      />
      <YourTurnModal
        isOpen={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
        userQueue={userQueue}
      />
      <LoadingModal isOpen={refreshLoading} /> {/* Add this line */}
    </section>
  );
}
