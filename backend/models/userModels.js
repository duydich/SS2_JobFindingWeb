const mongoose = require("mongoose");

//Tao schema cho User
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    phone: String,
    location: String,
    title: String,
    bio: String,
    company: String,
    website: String,

    role: {
        type: String,
        enum: ["student", "recruiter"],
        required: true
    },

    avatar: String,

    createdAt: {
        type: Date,
        default: Date.now
    },
    savedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
    }],
});

//Tao model User tu schema
const User = mongoose.model("User", userSchema);


module.exports = User;