const Job = require("../models/jobModels");

// Create Job
const createJob = async (req, res) => {
    try {
        console.log("INCOMING CREATE JOB DATA:", req.body);
        const { 
            title, description, requirements, salary, industry, 
            jobType, address, recruiter, company, coordinates,
            contactEmail, contactPhones, img
        } = req.body;

        const job = await Job.create({
            title,
            description,
            requirements,
            salary,
            industry,
            jobType,
            address,
            contactEmail,
            contactPhones,
            recruiter,
            company,
            img,
            location: {
                type: "Point",
                coordinates: coordinates || [0, 0] // [longitude, latitude]
            }
        });

        res.status(201).json({
            success: true,
            data: job
        });
    } catch (error) {
        console.error("API ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// Get All Jobs with Filter
const getJobs = async (req, res) => {
    try {
        const { keyword, industry, minSalary, maxSalary, lat, lng, radius } = req.query;

        let query = {};

        if (keyword) {
            query.title = { $regex: keyword, $options: "i" };
        }

        if (industry) {
            query.industry = industry;
        }

        // Location based filtering (if radius, lat, lng provided)
        if (lat && lng && radius) {
            query.location = {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseFloat(radius) * 1000 // Convert km to meters
                }
            };
        }

        const jobs = await Job.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: jobs
        });
    } catch (error) {
        console.error("API ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// Get Job by ID
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate("recruiter", "name email");
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }
        res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Update Job
const updateJob = async (req, res) => {
    try {
        const { 
            title, description, requirements, salary, industry, 
            jobType, address, contactEmail, contactPhones, img 
        } = req.body;

        const job = await Job.findByIdAndUpdate(
            req.params.id, 
            { 
                title, description, requirements, salary, industry, 
                jobType, address, contactEmail, contactPhones, img 
            }, 
            { new: true }
        );
        
        res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        console.error("UPDATE JOB ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// Delete Job
const deleteJob = async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Job deleted"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = { createJob, getJobs, getJobById, updateJob, deleteJob };