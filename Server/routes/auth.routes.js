// routes/auth.routes.js
const router = require("express").Router();
const {
  login,
  register,
  addAdmin,
  deleteAdmin,
  deletePatient,
} = require("../controllers/auth.controller");
const auth = require("../middlewares/auth.middleware");

router.post("/login", login);
router.post("/register", register);
router.post("/add-admin", auth, addAdmin);
router.delete("/delete-admin/:userId", auth, deleteAdmin);
router.delete("/delete-patient/:userId", auth, deletePatient);

module.exports = router;
