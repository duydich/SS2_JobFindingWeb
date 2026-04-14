const User = require("../models/userModels");
const bcrypt = require("bcryptjs");


// ================= REGISTER =================
const register = async (req, res) => {
    try {
        let { name, email, password, role } = req.body;


        // 1. Validate
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        // 2. Clean data
        name = name.trim();
        email = email.trim().toLowerCase();
        password = password.trim();

        // 3. Check email tồn tại
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        // 4. Hash password 
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "student",
            avatar: "",
        });

        console.log("User registered:", user.email);

        // 6. Response (không trả password)
        return res.status(201).json({
            success: true,
            message: "Register successful",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error("Register error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};



// ================= LOGIN =================
const login = async (req, res) => {
    try {
        let { email, password } = req.body;

        // 1. Validate
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing email or password",
            });
        }

        // 2. Clean data
        email = email.trim().toLowerCase();
        password = password.trim();

        // 3. Check user tồn tại
        const user = await User.findOne({ email });
        if (!user) {
            console.log("Login fail: User not found:", email);

            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // 4. Compare password 
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Login fail: Wrong password:", email);

            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        console.log("User logged in:", user.email);

        // 5. Response
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


// ================= GET USER =================
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        return res.json({
            success: true,
            data: user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ================= UPDATE USER =================
const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).select("-password");

        return res.json({
            success: true,
            data: user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = { register, login, getProfile, updateUser };