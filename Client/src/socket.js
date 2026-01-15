// App.js or QueuePage.js
import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // backend URL

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
