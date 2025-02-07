// 📂 routes/userRoutes.js
const express = require("express");
const { registerUser, updateUser } = require("../controllers/userController");

const router = express.Router();
router.post("/register", registerUser);
router.put("/users/:id", updateUser);

module.exports = router;