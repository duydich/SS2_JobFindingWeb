const express = require("express");
const router = express.Router();
const {
    applyForJob,
    getStudentApplications,
    getRecruiterApplications,
    updateApplicationStatus,
    withdrawApplication
} = require("../controllers/applicationControllers");

router.post("/apply", applyForJob);
router.get("/student/:studentId", getStudentApplications);
router.get("/recruiter/:recruiterId", getRecruiterApplications);
router.put("/:applicationId/status", updateApplicationStatus);
router.delete("/:applicationId", withdrawApplication);

module.exports = router;