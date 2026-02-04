// routes/auth.routes.js
const router = require("express").Router();
const {
  login,
  register,
  addAdmin,
  deleteAdmin,
  deletePatient,
  updateProfile,
  uploadProfileImage,
} = require("../controllers/auth.controller");
const auth = require("../middlewares/auth.middleware");

router.post("/login", login);
router.post("/register", register);
router.post("/add-admin", auth, addAdmin);
router.delete("/delete-admin/:userId", auth, deleteAdmin);
router.delete("/delete-patient/:userId", auth, deletePatient);
router.put("/profile", auth, uploadProfileImage, updateProfile);

module.exports = router;
