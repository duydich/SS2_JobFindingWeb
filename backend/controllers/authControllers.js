const User = require("../models/userModels");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing email or password"
            });
        }

        // 2. Check user
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            console.log("Login fail: User not found:", email);

            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // 3. Compare password
        const isMatch = password === user.password;
        if (!isMatch) {
            console.log("Login fail: Wrong password:", email);

            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        console.log("User logged in:", user.email);

        // 4. Response
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = { login };