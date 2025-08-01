const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"]; // Get the "Authorization" header
    const token = authHeader && authHeader.split(" ")[1]; // Extract the token from "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: "Access denied! No token provided." });
    }

    try {
        // Verify the token using the secret key
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified; // Attach the verified user information to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ message: "Invalid token!" });
    }
};

module.exports = authenticateToken;
