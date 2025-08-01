const express = require('express');
const Internship = require('../models/Internship'); // Import Internship model
const router = express.Router();

// ✅ Fetch Internships Based on Skills & Location
router.get('/fetch', async (req, res) => {
    try {
        const { location, skills } = req.query; // Get parameters from frontend

        // Find internships matching location & skills
        const internships = await Internship.findAll({
            where: {
                location,
                skills_required: { [Op.like]: `%${skills}%` }
            }
        });

        if (internships.length === 0) {
            return res.status(404).json({ message: 'No matching internships found!' });
        }

        res.status(200).json({ internships });

    } catch (error) {
        console.error('❌ Error fetching internships:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
