const SavedJob = require("../models/savedJobModels");

// Save/Unsave Job
const toggleSavedJob = async (req, res) => {
    try {
        const { userId, jobId } = req.body;

        const existing = await SavedJob.findOne({ user: userId, job: jobId });

        if (existing) {
            await SavedJob.deleteOne({ _id: existing._id });
            return res.status(200).json({
                success: true,
                isSaved: false,
                message: "Job removed from saved list"
            });
        } else {
            await SavedJob.create({ user: userId, job: jobId });
            return res.status(201).json({
                success: true,
                isSaved: true,
                message: "Job saved successfully"
            });
        }
    } catch (error) {
        console.error("Toggle Saved Job Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Get all saved jobs for a user
const getSavedJobs = async (req, res) => {
    try {
        const { userId } = req.params;
        const saved = await SavedJob.find({ user: userId }).populate("job");

        res.status(200).json({
            success: true,
            data: saved.map(s => s.job).filter(j => j !== null)
        });
    } catch (error) {
        console.error("Get Saved Jobs Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = { toggleSavedJob, getSavedJobs };