require("dotenv").config();
 
const express = require("express");
const connectDB = require("./config/db");
 const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
 
const app = express();
 
const PORT = process.env.PORT || 5000;
 
// Connect MongoDB
connectDB();
 app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
// Middleware
app.use(express.json());
 
// Routes
app.use("/api/auth", authRoutes);
 
// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Authentication API is running",
  });
});
 
// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});