const router = require("express").Router();
const {
  getAllServices,
  createService,
  updateService,
  deleteService,
} = require("../controllers/services.controller");

// Get all services (frontend)
router.get("/", getAllServices);

// Create a new service (admin)
router.post("/", createService);

// Edit a service (admin)
router.put("/:id", updateService);

// Delete a service (admin)
router.delete("/:id", deleteService);

module.exports = router;
