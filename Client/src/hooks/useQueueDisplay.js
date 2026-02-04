import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const useQueueDisplay = () => {
  const [servicesWithQueues, setServicesWithQueues] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    // Check localStorage on mount
    const saved = localStorage.getItem("queueDisplayVoiceEnabled");
    return saved === "true";
  });
  const socketRef = useRef(null);
  const previousServingRef = useRef({});
  const audioContextRef = useRef(null);
  const announcementQueueRef = useRef([]);

  // Fetch all active queues
  const fetchActiveQueues = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/queue/display`
      );
      const data = await response.json();
      
      if (data.services) {
        // Check for changes in serving queue and announce
        data.services.forEach((service) => {
          if (service.currentlyServing) {
            const previousServing = previousServingRef.current[service._id];
            const currentServing = service.currentlyServing.queueCode;
            
            // If the serving queue has changed, announce it
            if (previousServing && previousServing !== currentServing) {
              announceQueue(
                currentServing,
                service.name
              );
            }
            
            previousServingRef.current[service._id] = currentServing;
          }
        });
        
        setServicesWithQueues(data.services);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching queue display:", err);
      setLoading(false);
    }
  };

  // Play notification beep
  const playBeep = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.5);
    } catch (err) {
      console.error("Error playing beep:", err);
    }
  };

  // Web Speech API to announce queue
  const announceQueue = (queueCode, serviceName) => {
    console.log("Attempting to announce:", queueCode, "for", serviceName);
    
    // Add to announcement queue
    const announcement = { queueCode, serviceName, timestamp: Date.now() };
    announcementQueueRef.current.push(announcement);
    
    // Play beep first
    playBeep();
    
    if ("speechSynthesis" in window) {
      // Process the queue
      const processQueue = () => {
        if (announcementQueueRef.current.length === 0) return;
        
        // Check if already speaking
        if (window.speechSynthesis.speaking) {
          console.log("Speech already in progress, will announce after current completes");
          return;
        }
        
        // Get next announcement
        const next = announcementQueueRef.current.shift();
        
        const utterance = new SpeechSynthesisUtterance(
          `Now serving ${next.queueCode} for ${next.serviceName}. Please proceed to the counter.`
        );
        
        utterance.lang = "en-US";
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        // Handle speech start
        utterance.onstart = () => {
          console.log("Speech started for:", next.queueCode);
        };

        // Handle speech errors
        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event);
          console.error("Error details:", event.error);
          // Try to process next in queue
          setTimeout(processQueue, 500);
        };

        utterance.onend = () => {
          console.log("Announcement completed for:", next.queueCode);
          // Process next announcement after a short delay
          setTimeout(processQueue, 1000);
        };

        console.log("Speaking utterance... (queue size:", announcementQueueRef.current.length, ")");
        window.speechSynthesis.speak(utterance);
      };
      
      // Start processing after beep delay
      setTimeout(processQueue, 600);
    } else {
      console.warn("Speech Synthesis not supported in this browser");
    }
  };

  // Enable voice and test it
  const enableVoice = () => {
    console.log("Enabling voice...");
    
    // Initialize audio context on user interaction
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Resume audio context if suspended
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    // Test beep
    playBeep();
    
    // Test speech
    setTimeout(() => {
      if ("speechSynthesis" in window) {
        // Get voices (this helps initialize the API)
        const voices = window.speechSynthesis.getVoices();
        console.log("Available voices:", voices.length);
        
        const utterance = new SpeechSynthesisUtterance(
          "Voice enabled. You will hear announcements when patients are called."
        );
        utterance.lang = "en-US";
        utterance.rate = 1;
        utterance.volume = 1;
        
        utterance.onend = () => {
          console.log("Test announcement completed");
          setVoiceEnabled(true);
          // Persist to localStorage
          localStorage.setItem("queueDisplayVoiceEnabled", "true");
        };
        
        utterance.onerror = (event) => {
          console.error("Test speech error:", event);
        };
        
        window.speechSynthesis.speak(utterance);
      }
    }, 700);
  };

  useEffect(() => {
    // Initial fetch
    fetchActiveQueues();
    
    // Try to load voices on mount
    if ("speechSynthesis" in window) {
      // Load voices
      window.speechSynthesis.getVoices();
      
      // Some browsers need this event
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => {
          console.log("Voices loaded:", window.speechSynthesis.getVoices().length);
        };
      }
    }

    // Set up Socket.io connection for real-time updates
    socketRef.current = io(import.meta.env.VITE_API_URL.replace("/api", ""));

    socketRef.current.on("connect", () => {
      console.log("Queue Display connected to socket server");
    });

    // Listen for dashboard updates (queue changes)
    socketRef.current.on("dashboardUpdate", () => {
      fetchActiveQueues();
    });

    // Listen for queue called events (when admin explicitly calls next patient)
    socketRef.current.on("queueCalled", (data) => {
      console.log("Queue called event received:", data);
      
      // Immediately announce the called queue
      if (data.queueCode && data.serviceName) {
        announceQueue(data.queueCode, data.serviceName);
        
        // Also update the display
        fetchActiveQueues();
      }
    });

    // Refresh data every 30 seconds as a fallback
    const refreshInterval = setInterval(() => {
      fetchActiveQueues();
    }, 30000);

    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      clearInterval(refreshInterval);
      clearInterval(timeInterval);
    };
  }, []);

  return {
    servicesWithQueues,
    currentTime,
    loading,
    voiceEnabled,
    enableVoice,
    testAnnouncement: () => announceQueue("TEST01", "Test Service"),
  };
};
