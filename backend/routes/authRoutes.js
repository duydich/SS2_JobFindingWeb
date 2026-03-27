const express = require("express");
const router = express.Router();

const { login } = require("../controllers/authControllers");

// API login
router.post("/login", login);

module.exports = router;
console.log(__dirname)