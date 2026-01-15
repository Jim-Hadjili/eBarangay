const router = require("express").Router();
const {
  getAllServices,
  createService,
  updateService,
} = require("../controllers/services.controller");

// Get all services (frontend)
router.get("/", getAllServices);

// Create a new service (admin)
router.post("/", createService);

// Edit a service (admin)
router.put("/:id", updateService);

module.exports = router;
