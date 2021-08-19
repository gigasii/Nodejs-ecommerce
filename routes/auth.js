// Third-party packages
const express = require("express");
const { body } = require("express-validator");

// Imports
const authController = require("../controllers/auth");

// Initilization
const router = express.Router();

// Set routes
router.get("/login", authController.getLogIn);
router.post("/login", authController.postLogIn);
router.post("/logout", authController.postLogOut);
router.get("/signup", authController.getSignUp);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

router.post(
  "/signup",
  [
    body("email", "Invalid email").isEmail().normalizeEmail(),
    body("password", "Invalid password")
      .isLength({ min: 1, max: 20 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postSignUp
);

// Export
module.exports = router;
