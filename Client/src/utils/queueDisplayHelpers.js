/**
 * Formats a date object to time string (HH:MM:SS AM/PM)
 * @param {Date} date - The date object to format
 * @returns {string} Formatted time string
 */
export const formatTime = (date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

/**
 * Formats a date object to full date string (Weekday, Month Day, Year)
 * @param {Date} date - The date object to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Calculates estimated waiting time based on queue position
 * @param {number} position - Position in the queue
 * @param {number} minutesPerPatient - Average minutes per patient (default: 15)
 * @returns {string} Estimated time string
 */
export const calculateEstimatedTime = (position, minutesPerPatient = 15) => {
  const estimatedMinutes = position * minutesPerPatient;
  return `${estimatedMinutes} mins`;
};
