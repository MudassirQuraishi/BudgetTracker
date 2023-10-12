const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

/**
 * Middleware to authenticate a user using a JWT token.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Next middleware function.
 */
exports.authenticateToken = async (req, res, next) => {
	try {
		// Extract the JWT token from the request headers
		const token = req.headers.authorization;

		// Verify the token using the secret key
		const secretKey = process.env.JWT_SECRET_KEY;
		const decodedId = jwt.verify(token, secretKey);

		// Find the user associated with the decoded user ID
		const loggedInUserData = await User.findOne({ _id: decodedId.userId });

		// Check if a user is found
		if (!loggedInUserData) {
			return res.status(401).json({ error: "User not found" });
		}

		// Assign the user data to the request object
		req.user = loggedInUserData;

		// Continue with the next middleware
		next();
	} catch (error) {
		// Handle token verification or other errors
		console.error("Authentication error:", error);
		res.status(500).json({ error: "Error in the Authentication" });
	}
};
