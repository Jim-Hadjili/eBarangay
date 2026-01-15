const router = require("express").Router();
const {
  getServiceQueue,
  joinQueue,
  getUserQueue,
  cancelQueue,
  callNextInQueue,
  markAsServed,
} = require("../controllers/queue.controller");
const auth = require("../middlewares/auth.middleware");

router.get("/service/:serviceId", getServiceQueue);
router.post("/join", auth, joinQueue);
router.get("/my-queue", auth, getUserQueue);
router.delete("/cancel", auth, cancelQueue);
router.post("/call-next", auth, callNextInQueue); // Admin only
router.delete("/mark-served/:queueId", auth, markAsServed); // Admin only

module.exports = router;
