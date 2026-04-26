const express = require("express");
const router = express.Router();
const { toggleSavedJob, getSavedJobs } = require("../controllers/savedJobControllers");

router.post("/toggle", toggleSavedJob);
router.get("/:userId", getSavedJobs);

module.exports = router;