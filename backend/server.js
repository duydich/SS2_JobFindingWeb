const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

//API login chua co database
app.post(`/login`, (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@gmail.com" && password === "123") {
    res.json({ message: "Login thanh cong" });
  }
  else {
    res.status(401).json({ message: "Sai tai khoan" })
  }
});


// Route test
app.get("/", (req, res) => {
  res.send("API is running");
});

//API test
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend OK" });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


