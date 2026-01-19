// routes/auth.routes.js
const router = require("express").Router();
const { login, register, addAdmin } = require("../controllers/auth.controller");
const auth = require("../middlewares/auth.middleware");

router.post("/login", login);
router.post("/register", register);
router.post("/add-admin", auth, addAdmin);

module.exports = router;
