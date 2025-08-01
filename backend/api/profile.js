const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require("../db");

// ✅ Middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token." });
        req.user = user; // contains email and id
        next();
    });
}

// 🔹 GET Profile
router.get("/", authenticateToken, (req, res) => {
    const email = req.user.email;

    const query = "SELECT location, skills FROM students WHERE email = ?";
    db.query(query, [email], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error." });
        if (results.length === 0) return res.status(404).json({ message: "Profile not found." });

        const { location, skills } = results[0];
        res.json({ email, location, skills });
    });
});

// 🔹 PUT Profile
router.put("/", authenticateToken, (req, res) => {
    const email = req.user.email;
    const { location, skills } = req.body;

    if (!location || !skills) {
        return res.status(400).json({ message: "Both location and skills are required." });
    }

    const query = "UPDATE students SET location = ?, skills = ? WHERE email = ?";
    db.query(query, [location, skills, email], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error during update." });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Profile not found for update." });
        }

        res.json({ message: "Profile updated successfully!" });
    });
});

module.exports = router;
