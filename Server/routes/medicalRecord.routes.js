// Create Server/routes/medicalRecord.routes.js
const router = require("express").Router();
const {
  createMedicalRecord,
  getPatientMedicalRecords,
  getMedicalRecordById,
  updateMedicalRecord,
} = require("../controllers/medicalRecord.controller");
const auth = require("../middlewares/auth.middleware");

router.post("/", auth, createMedicalRecord);
router.get("/patient/:patientId", auth, getPatientMedicalRecords);
router.get("/:recordId", auth, getMedicalRecordById);
router.put("/:recordId", auth, updateMedicalRecord);

module.exports = router;
