import { useEffect, useRef, useState } from "react";
import socketService from "../services/socketService";

export const useSocket = (onYourTurn, onSkipped) => {
  const socketRef = useRef(null);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [skippedModalOpen, setSkippedModalOpen] = useState(false);

  useEffect(() => {
    // Use the singleton socket service
    socketRef.current = socketService.getSocket();

    const handleYourTurn = (data) => {
      console.log("It's your turn!", data);
      setNotificationModalOpen(true);
      playNotificationSound();
      vibrateDevice();

      // Show browser notification if permitted
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("It's Your Turn!", {
          body: data.message,
          icon: "/images/Logo.png",
        });
      }

      if (onYourTurn) {
        onYourTurn(data);
      }
    };

    const handlePatientSkipped = (data) => {
      console.log("You have been skipped!", data);
      setNotificationModalOpen(false); // Close "Your Turn" modal
      setSkippedModalOpen(true);
      playNotificationSound();
      vibrateDevice();

      // Show browser notification if permitted
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("You Have Been Skipped", {
          body: data.message || "You were skipped for not responding in time.",
          icon: "/images/Logo.png",
        });
      }

      if (onSkipped) {
        onSkipped(data);
      }
    };

    // Listen for "your turn" notification
    socketService.on("yourTurn", handleYourTurn);

    // Listen for "patient skipped" notification
    socketService.on("patientSkipped", handlePatientSkipped);

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => {
      // Clean up listeners but don't disconnect the singleton socket
      socketService.off("yourTurn", handleYourTurn);
      socketService.off("patientSkipped", handlePatientSkipped);
    };
  }, [onYourTurn, onSkipped]);

  const playNotificationSound = () => {
    const audio = new Audio("/notification.mp3");
    audio.play().catch((err) => console.log("Audio play failed:", err));
  };

  const vibrateDevice = () => {
    if (navigator.vibrate) {
      navigator.vibrate([500, 200, 500]);
    }
  };

  const joinQueueRoom = (queueCode) => {
    socketService.emit("joinQueueRoom", queueCode);
  };

  const leaveQueueRoom = (queueCode) => {
    socketService.emit("leaveQueueRoom", queueCode);
  };

  return {
    socket: socketRef.current,
    notificationModalOpen,
    setNotificationModalOpen,
    skippedModalOpen,
    setSkippedModalOpen,
    joinQueueRoom,
    leaveQueueRoom,
  };
};
