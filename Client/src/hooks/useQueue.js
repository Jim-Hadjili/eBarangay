import { useState, useEffect, useCallback } from "react";
import { getToken } from "../utils/session";

export const useQueue = (joinQueueRoom) => {
  const [userQueue, setUserQueue] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [queueData, setQueueData] = useState({
    queue: [],
    nextNumber: null,
    limit: null,
    identifier: null,
  });

  const checkUserQueue = useCallback(async () => {
    try {
      const token = getToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/queue/my-queue`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.hasQueue) {
        setUserQueue(data.queue);
        // Join the socket room for this queue
        if (joinQueueRoom) {
          joinQueueRoom(data.queue.queueCode);
        }
      } else {
        setUserQueue(null);
      }
    } catch (err) {
      console.error("Error checking user queue:", err);
    }
  }, [joinQueueRoom]);

  useEffect(() => {
    checkUserQueue();
  }, [checkUserQueue]);

  const fetchQueueForService = async (service) => {
    setSelectedService(service);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/queue/service/${service._id}`
      );
      const data = await response.json();
      setQueueData({
        queue: data.queue || [],
        nextNumber: data.nextNumber,
        limit: data.limit,
        identifier: data.identifier || service.identifier,
      });
    } catch {
      setQueueData({
        queue: [],
        nextNumber: null,
        limit: null,
        identifier: null,
      });
    }
  };

  const joinQueue = async (serviceId) => {
    try {
      const token = getToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/queue/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ serviceId }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        await checkUserQueue();
        return { success: true, data };
      } else {
        return {
          success: false,
          message: data.message || "Failed to join queue",
        };
      }
    } catch (err) {
      return { success: false, message: "Error joining queue" };
    }
  };

  const cancelQueue = async (leaveQueueRoom) => {
    try {
      const token = getToken();

      // Leave socket room before canceling
      if (leaveQueueRoom && userQueue) {
        leaveQueueRoom(userQueue.queueCode);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/queue/cancel`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setUserQueue(null);
        return { success: true, data };
      } else {
        return {
          success: false,
          message: data.message || "Failed to cancel queue",
        };
      }
    } catch (err) {
      return { success: false, message: "Error canceling queue" };
    }
  };

  return {
    userQueue,
    selectedService,
    queueData,
    checkUserQueue,
    fetchQueueForService,
    joinQueue,
    cancelQueue,
  };
};
