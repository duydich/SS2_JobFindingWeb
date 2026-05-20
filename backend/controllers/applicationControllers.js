const Application = require("../models/applicationModels");
const Job = require("../models/jobModels");

const applyForJob = async (req, res) => {
    try {
        const { jobId, studentId } = req.body;

        // Check if already applied
        const existingApp = await Application.findOne({ job: jobId, student: studentId });
        if (existingApp) {
            return res.status(400).json({ success: false, message: "Already applied for this job" });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        const application = new Application({
            job: jobId,
            student: studentId,
            recruiter: job.recruiter
        });

        await application.save();
        res.status(201).json({ success: true, data: application });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getStudentApplications = async (req, res) => {
    try {
        const { studentId } = req.params;
        const applications = await Application.find({ student: studentId })
            .populate("job")
            .sort({ appliedAt: -1 });
        res.status(200).json({ success: true, data: applications });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getRecruiterApplications = async (req, res) => {
    try {
        const { recruiterId } = req.params;
        const applications = await Application.find({ recruiter: recruiterId })
            .populate("job")
            .populate("student")
            .sort({ appliedAt: -1 });
        res.status(200).json({ success: true, data: applications });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const updateApplicationStatus = async (req, res) => {
// ... (keep existing)
// ...
};

const withdrawApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const application = await Application.findByIdAndDelete(applicationId);

        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        res.status(200).json({ success: true, message: "Application withdrawn successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    applyForJob,
    getStudentApplications,
    getRecruiterApplications,
    updateApplicationStatus,
    withdrawApplication
};