const router = require("express").Router();
const {
  getServiceQueue,
  joinQueue,
  getUserQueue,
  cancelQueue,
  callNextInQueue,
  recallSkippedPatient,
  removeFromRecallList,
  markAsServed,
  skipQueue,
  getAllActiveQueues,
  getQueueDisplay,
  getQueueHistory,
} = require("../controllers/queue.controller");
const auth = require("../middlewares/auth.middleware");

// Public routes (no authentication required)
router.get("/display", getQueueDisplay); // Public display for TV screens

// Service-specific routes
router.get("/service/:serviceId", getServiceQueue);
router.post("/join", auth, joinQueue);
router.get("/my-queue", auth, getUserQueue);
router.get("/history", auth, getQueueHistory);
router.delete("/cancel", auth, cancelQueue);
router.post("/call-next", auth, callNextInQueue); // Admin only
router.post("/recall/:queueId", auth, recallSkippedPatient); // Admin only - recall skipped patient
router.delete("/remove/:queueId", auth, removeFromRecallList); // Admin only - remove from recall list
router.delete("/mark-served/:queueId", auth, markAsServed); // Admin only
router.post("/skip/:queueId", auth, skipQueue); // Admin only
router.get("/active-queues", auth, getAllActiveQueues); // Admin only - for monitoring

module.exports = router;
