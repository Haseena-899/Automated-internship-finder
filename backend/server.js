// server.js

require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Sequelize, DataTypes, Op } = require("sequelize");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  }
);

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Database connection error:", error);
  }
}
connectDB();

// Models
const Student = sequelize.define(
  "students",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: true },
    skills: { type: DataTypes.TEXT, allowNull: true },
  },
  { timestamps: true }
);

const Internship = sequelize.define(
  "Internship",
  {
    company: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    skills_required: { type: DataTypes.TEXT, allowNull: false },
    description: { type: DataTypes.TEXT },
  },
  { timestamps: true }
);

sequelize
  .sync({ alter: true })
  .then(() => console.log("✅ Database tables synced successfully!"))
  .catch((error) =>
    console.error("❌ Error syncing database tables:", error)
  );

// JWT Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Access denied! No token provided." });

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token!" });
  }
};

/* ========== AUTH ROUTES ========== */

// Sign Up
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await Student.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists!" });

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Student.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Signup failed", details: error.message });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Student.findOne({ where: { email } });

    if (!user) return res.status(400).json({ message: "User not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid password!" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful!", token, userId: user.id });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
});

/* ========== PROFILE ROUTES ========== */

// Get Profile
app.get("/api/profile", authenticateToken, async (req, res) => {
  try {
    const user = await Student.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching profile", details: error.message });
  }
});

// Update Profile
app.put("/api/profile", authenticateToken, async (req, res) => {
  try {
    const { location, skills } = req.body;
    const user = await Student.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.location = location;
    user.skills = skills;
    await user.save();

    res.status(200).json({ message: "Profile updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error updating profile", details: error.message });
  }
});

/* ========== INTERNSHIP ROUTES ========== */

// Get Internships Based on Profile (Local DB)
app.get("/api/internships", authenticateToken, async (req, res) => {
  try {
    const user = await Student.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.skills || !user.location) {
      return res
        .status(400)
        .json({ message: "Please update your skills and location first." });
    }

    const skillList = user.skills.split(",").map((skill) => skill.trim());
    const skillConditions = skillList.map((skill) => ({
      skills_required: { [Op.like]: `%${skill}%` },
    }));

    const internships = await Internship.findAll({
      where: {
        location: user.location,
        [Op.or]: skillConditions,
      },
    });

    if (internships.length === 0) {
      return res
        .status(200)
        .json({ message: "No internships found matching your skills and location." });
    }

    res.status(200).json(internships);
  } catch (error) {
    res.status(500).json({ error: "Error fetching internships", details: error.message });
  }
});

/* ========== EXTERNAL API (RAPIDAPI) ========== */

// Fetch from RapidAPI
// Fetch from RapidAPI
app.get("/api/rapidapi/internships", authenticateToken, async (req, res) => {
  try {
    const userId = req.query.userId || req.user.id;
    const user = await Student.findByPk(userId);

    if (!user || !user.skills || !user.location) {
      return res.status(400).json({ message: "Please complete your profile first." });
    }

    let keyword = user.skills.toLowerCase().trim();

    // Map keywords for better RapidAPI results
    if (keyword.includes("web")) {
      keyword = "web development";
    } else if (keyword.includes("java")) {
      keyword = "java";
    } else if (keyword.includes("python")) {
      keyword = "python";
    } else if (keyword.includes("ml") || keyword.includes("machine")) {
      keyword = "machine learning";
    } else if (keyword.includes("data")) {
      keyword = "data science";
    } else if (keyword.includes("ui") || keyword.includes("ux")) {
      keyword = "ui ux";
    } else {
      keyword = `${keyword}`;
    }

    console.log("🔎 Fetching internships with:", {
      keyword: keyword,
      location: user.location,
    });

    const apiURL = `${process.env.RAPIDAPI_BASE_URL}/active-jb-7d`;

    const response = await axios.get(apiURL, {
      params: {
        title_filter: keyword,
        location_filter: user.location,
      },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
      },
    }); // 👈 THIS closing brace and parenthesis were missing

    const jobs = response.data || [];

    console.log(`📄 RapidAPI returned ${jobs.length} jobs`);

    if (jobs.length === 0) {
      return res.status(200).json({ message: "No internships found from RapidAPI." });
    }

    res.status(200).json(jobs);
  } catch (error) {
    console.error("❌ RapidAPI Error:", error.message);
    res.status(500).json({
      error: "Failed to fetch internships from RapidAPI",
      details: error.message,
    });
  }
});

/* ========== START SERVER ========== */
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
); 