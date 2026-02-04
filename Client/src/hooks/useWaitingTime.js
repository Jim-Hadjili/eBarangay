import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const useWaitingTime = (queueId, serviceId, queueCode) => {
  const [waitingTimeData, setWaitingTimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!queueId || !serviceId) {
      console.log("useWaitingTime: Missing required params", {
        queueId,
        serviceId,
      });
      setWaitingTimeData(null);
      setLoading(false);
      return;
    }

    console.log("useWaitingTime: Initializing", {
      queueId,
      serviceId,
      queueCode,
    });

    // Initialize socket connection
    socketRef.current = io(import.meta.env.VITE_API_URL.replace("/api", ""));

    // Fetch initial waiting time data
    const fetchWaitingTime = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = `${import.meta.env.VITE_API_URL}/waiting-time/service/${serviceId}`;
        console.log("Fetching waiting time from:", url);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch waiting time");
        }

        const data = await response.json();
        console.log("Received waiting time data:", data);

        if (data.isMonitored && data.waitingTimes) {
          // Find the current patient's waiting time
          const myWaitingTime = data.waitingTimes.find(
            (wt) => wt.queueId === queueId,
          );

          console.log("My waiting time:", myWaitingTime);

          setWaitingTimeData({
            ...myWaitingTime,
            averageConsultationTime: data.averageConsultationTime,
            isMonitored: data.isMonitored,
            completedCount: data.completedCount,
          });
        } else {
          console.log("Service not monitored or no waiting times");
          setWaitingTimeData({
            isMonitored: false,
            estimatedWaitingTime: null,
            estimatedWaitingTimeFormatted: "Not available",
          });
        }
      } catch (err) {
        console.error("Error fetching waiting time:", err);
        setError(err.message);
        setWaitingTimeData({
          isMonitored: false,
          estimatedWaitingTime: null,
          estimatedWaitingTimeFormatted: "Not available",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWaitingTime();

    // Join queue room to receive personal updates
    if (queueCode && socketRef.current) {
      socketRef.current.emit("joinQueueRoom", queueCode);
    }

    // Listen for waiting time updates for this specific patient
    if (socketRef.current) {
      socketRef.current.on("yourWaitingTime", (data) => {
        console.log("Received waiting time update:", data);
        setWaitingTimeData((prev) => ({
          ...prev,
          estimatedWaitingTime: data.estimatedWaitingTime,
          estimatedWaitingTimeFormatted: data.estimatedWaitingTimeFormatted,
          position: data.position,
          averageConsultationTime: data.averageConsultationTime,
        }));
      });

      // Listen for general service waiting time updates
      socketRef.current.on("waitingTimeUpdate", (data) => {
        console.log("Received service waiting time update:", data);
        if (data.isMonitored && data.waitingTimes) {
          const myWaitingTime = data.waitingTimes.find(
            (wt) => wt.queueId === queueId,
          );

          if (myWaitingTime) {
            setWaitingTimeData({
              ...myWaitingTime,
              averageConsultationTime: data.averageConsultationTime,
              isMonitored: data.isMonitored,
              completedCount: data.completedCount,
            });
          }
        }
      });
    }

    // Cleanup
    return () => {
      if (socketRef.current) {
        if (queueCode) {
          socketRef.current.emit("leaveQueueRoom", queueCode);
        }
        socketRef.current.off("yourWaitingTime");
        socketRef.current.off("waitingTimeUpdate");
        socketRef.current.disconnect();
      }
    };
  }, [queueId, serviceId, queueCode]);

  return {
    waitingTimeData,
    loading,
    error,
  };
};
