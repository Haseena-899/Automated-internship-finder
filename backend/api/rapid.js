const express = require("express");
const axios = require("axios");
require("dotenv").config();

module.exports = () => {
  const router = express.Router();

  router.get("/internships", async (req, res) => {
    try {
      const response = await axios.get(`${process.env.RAPIDAPI_BASE_URL}/job-board-api`, {
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": process.env.RAPIDAPI_HOST
        }
      });

      res.status(200).json({ internships: response.data });
    } catch (error) {
      console.error("Error fetching internships from RapidAPI:", error.message);
      res.status(500).json({
        error: "Failed to fetch internships from RapidAPI",
        details: error.message
      });
    }
  });

  return router;
};
