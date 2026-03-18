// routes/auth.routes.js
const router = require("express").Router();
const {
  login,
  register,
  verifyEmail,
  addAdmin,
  deleteAdmin,
  deletePatient,
  updateProfile,
  uploadProfileImage,
  getCurrentUser,
} = require("../controllers/auth.controller");
const auth = require("../middlewares/auth.middleware");

router.post("/login", login);
router.post("/register", register);
router.get("/verify-email", verifyEmail);
router.get("/me", auth, getCurrentUser);
router.post("/add-admin", auth, addAdmin);
router.delete("/delete-admin/:userId", auth, deleteAdmin);
router.delete("/delete-patient/:userId", auth, deletePatient);
router.put("/profile", auth, uploadProfileImage, updateProfile);

module.exports = router;
