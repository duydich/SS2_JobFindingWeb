require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./dbconfig/dbConnection");
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const savedJobRoutes = require("./routes/savedJobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

// 1. Middleware
// Cho phép tất cả các nguồn (CORS)
app.use(cors({
    origin: "*", // Thử cho phép tất cả các nguồn trước
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Nâng giới hạn giới hạn nhận dữ liệu để lưu được ảnh Base64
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// 2. Kết nối DB
connectDB();

// 3. Routes
// Test route để kiểm tra server
app.get("/test", (req, res) => {
    res.json({ success: true, message: "Server is working properly" });
});

app.use("/api", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/saved-jobs", savedJobRoutes);
app.use("/api/applications", applicationRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});