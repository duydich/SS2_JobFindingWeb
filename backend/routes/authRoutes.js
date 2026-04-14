const express = require("express");
const router = express.Router();

const { login } = require("../controllers/authControllers");
const { register } = require("../controllers/authControllers");
const { getProfile } = require("../controllers/authControllers");
const { updateUser } = require("../controllers/authControllers");


// API login
router.post("/register", register);
router.post("/login", login);

router.get("/profile/:id", getProfile);
router.put("/update/:id", updateUser);


module.exports = router;
console.log(__dirname)