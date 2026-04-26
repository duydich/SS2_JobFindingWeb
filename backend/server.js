const express = require("express");
const cors = require("cors");
const connectDB = require("./dbconfig/dbConnection");
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const savedJobRoutes = require("./routes/savedJobRoutes");

const app = express();

// 1. Middleware
app.use(cors());
// Nâng giới hạn giới hạn nhận dữ liệu để lưu được ảnh Base64
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// 2. Kết nối DB
connectDB();

// 3. Routes
app.use("/api", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/saved-jobs", savedJobRoutes);

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});