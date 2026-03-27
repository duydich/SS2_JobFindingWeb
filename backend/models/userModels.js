const mongoose = require("mongoose");

//Tao schema cho User
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: {
        type: String,
        enum: ["student", "recruiter"],
        required: true
    },

    avatar: String,

    createdAt: {
        type: Date,
        default: Date.now
    }
});

//Tao model User tu schema
const User = mongoose.model("User", userSchema);


module.exports = User;