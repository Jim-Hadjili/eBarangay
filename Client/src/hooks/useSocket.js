import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export const useSocket = (onYourTurn, onSkipped) => {
  const socketRef = useRef(null);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [skippedModalOpen, setSkippedModalOpen] = useState(false);

  useEffect(() => {
    // Initialize Socket.io connection
    socketRef.current = io(import.meta.env.VITE_API_URL.replace("/api", ""));

    socketRef.current.on("connect", () => {
      console.log("Connected to socket server");
    });

    // Listen for "your turn" notification
    socketRef.current.on("yourTurn", (data) => {
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
    });

    // Listen for "patient skipped" notification
    socketRef.current.on("patientSkipped", (data) => {
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
    });

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
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
    if (socketRef.current) {
      socketRef.current.emit("joinQueueRoom", queueCode);
    }
  };

  const leaveQueueRoom = (queueCode) => {
    if (socketRef.current) {
      socketRef.current.emit("leaveQueueRoom", queueCode);
    }
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
