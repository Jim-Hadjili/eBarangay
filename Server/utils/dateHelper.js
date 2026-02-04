function getTodayMidnight() {
  const now = new Date();

  // Convert to Philippines timezone (UTC+8)
  const phTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Manila" }),
  );

  const sessionStart = new Date(phTime);
  sessionStart.setHours(19, 0, 0, 0); // 7:00 PM

  // If current time is before 7:00 PM, use yesterday's 7:00 PM
  if (phTime.getHours() < 19) {
    sessionStart.setDate(sessionStart.getDate() - 1);
  }

  return sessionStart;
}

function isToday(date) {
  const sessionStart = getTodayMidnight();
  const checkDate = new Date(date);

  // Get the next session start (24 hours after current session start)
  const nextSessionStart = new Date(sessionStart);
  nextSessionStart.setHours(nextSessionStart.getHours() + 24);

  // Check if the date falls within the current session window
  return checkDate >= sessionStart && checkDate < nextSessionStart;
}

module.exports = {
  getTodayMidnight,
  isToday,
};
