const express = require("express");

const app = express();

// Middleware
app.use(express.json());

// Route test
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});