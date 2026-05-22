const express = require("express");
const router = express.Router();

const {
    login,
    register,
    googleAuth,
    getProfile,
    updateUser,
    reviewCVWithAI
} = require("../controllers/authControllers");

// API login
router.post("/register", register);
router.post("/login", login);
router.post("/google-auth", googleAuth);
router.post("/cv-review", reviewCVWithAI);

// API info
router.get("/profile/:id", getProfile);
router.put("/update/:id", updateUser);


module.exports = router;
console.log(__dirname)