const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String },
    salary: { type: String, required: true },
    industry: { type: String, required: true },
    jobType: { 
        type: String, 
        enum: ["Full-time", "Part-time"],
        default: "Part-time"
    },
    address: { type: String, required: true },
    contactEmail: { type: String },
    contactPhones: [{ type: String }],
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            index: "2dsphere"
        }
    },
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    company: { type: String },
    img: { type: String }, // Store image URL or base64
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;