const express = require('express');
const bcrypt = require('bcryptjs'); // For password hashing
const Student = require('../models/Student'); // Import Student model
const router = express.Router();

// ✅ Student Registration API
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, location, skills } = req.body;

        // Check if all required fields are present
        if (!name || !email || !password || !location || !skills) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        // Check if email is valid
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format!' });
        }

        // Check if student already exists
        const existingStudent = await Student.findOne({ where: { email } });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student already registered!' });
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new student
        const student = await Student.create({ name, email, password: hashedPassword, location, skills });
        res.status(201).json({ message: 'Registration successful!', student });

    } catch (error) {
        console.error('❌ Error registering student:', error);
        res.status(500).json({ message: 'Internal Server Error', details: error.message });
    }
});

module.exports = router;
