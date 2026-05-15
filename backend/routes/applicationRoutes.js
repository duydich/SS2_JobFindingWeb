const express = require("express");
const router = express.Router();
const {
    applyForJob,
    getStudentApplications,
    getRecruiterApplications,
    updateApplicationStatus
} = require("../controllers/applicationControllers");

router.post("/apply", applyForJob);
router.get("/student/:studentId", getStudentApplications);
router.get("/recruiter/:recruiterId", getRecruiterApplications);
router.put("/:applicationId/status", updateApplicationStatus);

module.exports = router;