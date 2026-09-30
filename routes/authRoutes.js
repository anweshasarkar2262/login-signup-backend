const express = require("express");
 
const {

  signup,

  login,

  getProfile,

} = require("../controllers/authControllers");
 
const protect = require("../middlewares/authMiddleware");
 
const router = express.Router();
 
// Public routes

router.post("/signup", signup);

router.post("/login", login);
 
// Protected route

router.get("/profile", protect, getProfile);
 
module.exports = router;
 