const User = require("../models/userModels");
const bcrypt = require("bcryptjs");


const { GoogleGenerativeAI } = require("@google/generative-ai");

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

//----------------------GG login-------------------------
const googleAuth = async (req, res) => {
    try {
        let {
            name,
            email,
            avatar,
            role
        } = req.body;

        // Clean data
        email = email.trim().toLowerCase();

        // Check user tồn tại chưa
        let user = await User.findOne({ email });

        // Nếu chưa có user -> tạo mới
        if (!user) {
            user = await User.create({
                name,
                email,
                password: null,
                role: role || "student",
                avatar,
                provider: "google",
            });

            console.log("Google user created:", user.email);
        } else {
            console.log("Google login:", user.email);
        }

        // Response
        return res.status(200).json({
            success: true,
            message: "Google authentication successful",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            },
        });

    } catch (error) {
        console.error("Google auth error:", error);

        return res.status(500).json({
            success: false,
            message: "Google authentication failed",
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
        console.error("Update User Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


// ================= AI CV REVIEW =================
const reviewCVWithAI = async (req, res) => {
    try {
        const { cvData } = req.body;
        if (!cvData) {
            return res.status(400).json({ success: false, message: "No CV data provided" });
        }

        // 1. Khởi tạo Gemini (Sử dụng model 'gemini-flash-latest' - bản ổn định nhất có sẵn trong tài khoản của bạn)
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // 2. Xử lý dữ liệu Base64
        const parts = cvData.split(",");
        const mimeType = parts[0].split(":")[1].split(";")[0];
        const base64Data = parts[1];

        // 3. Cấu hình Prompt theo yêu cầu của người dùng
        const prompt = "Bạn là một chuyên gia tuyển dụng cao cấp. Hãy phân tích CV này và đưa ra nhận xét chi tiết bằng tiếng Việt bao gồm: 1. Điểm mạnh, 2. Các điểm cần cải thiện, 3. Đánh giá mức độ phù hợp chung và 4. Điểm số (0-10). Hãy trình bày thật chuyên nghiệp và rõ ràng dưới dạng Markdown.";

        // 4. Gửi yêu cầu lên Gemini
        const result = await model.generateContent([
            { text: prompt },
            {
                inlineData: {
                    mimeType: mimeType,
                    data: base64Data
                }
            }
        ]);

        const response = await result.response;
        const text = response.text();

        return res.status(200).json({
            success: true,
            data: text
        });
    } catch (error) {
        console.error("Gemini AI Error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "AI Review failed", 
            error: error.message 
        });
    }
};


module.exports = { register, login, googleAuth, getProfile, updateUser, reviewCVWithAI };