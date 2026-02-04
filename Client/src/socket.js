import { useEffect } from "react";
import { io } from "socket.io-client";

// Remove '/api' from the URL for socket connection
const socketURL = import.meta.env.VITE_API_URL.replace("/api", "");
const socket = io(socketURL);

function QueuePage({ queueId }) {
  useEffect(() => {
    // Join the queue room
    socket.emit("joinQueue", queueId);

    // Listen for 'yourTurn' notification
    socket.on("yourTurn", (message) => {
      alert(message); // simple browser alert
      playNotificationSound();
      vibrateDevice();
    });

    return () => {
      socket.disconnect();
    };
  }, [queueId]);

  const playNotificationSound = () => {
    const audio = new Audio("/alert.mp3"); // put a sound file in public folder
    audio.play();
  };

  const vibrateDevice = () => {
    if (navigator.vibrate) {
      navigator.vibrate([500, 200, 500]); // vibrate pattern
    }
  };

  return (
    <div>
      <h1>Your Queue: {queueId}</h1>
      <p>Waiting for your turn...</p>
    </div>
  );
}

export default QueuePage;
