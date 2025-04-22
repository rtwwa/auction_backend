const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller.js");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", authController.getMe);

module.exports = router;
