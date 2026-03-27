const express = require("express");
const cors = require("cors");
const connectDB = require("./dbconfig/dbConnection");
const authRoutes = require("./routes/authRoutes");

const app = express();

// 1. Middleware
app.use(cors()); // cho phép frontend gọi API
app.use(express.json()); // đọc JSON

// 2. Kết nối DB
connectDB();

/// 3. Routes
app.use("/api", authRoutes);

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


