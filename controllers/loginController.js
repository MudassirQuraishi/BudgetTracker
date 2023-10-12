const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

/**
 * Middleware to handle user signup.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
exports.signup = async (req, res) => {
	try {
		const saltRounds = 10;
		const { password, email } = req.body;

		// Hash the user's password
		const hash = await bcrypt.hash(password, saltRounds);

		// Check if a user with the same email already exists
		const existingUser = await User.findOne({ userEmail: email });
		if (existingUser) {
			return res.status(409).json({ success: false, message: "User Already Exists" });
		}

		// Create a new user with hashed password
		const user = await User.create({
			userName: req.body.name,
			userEmail: req.body.email,
			userPassword: hash,
		});

		console.log(user);
		res.status(201).json({ success: true, message: "User created successfully" });
	} catch (error) {
		console.error("Error in user signup:", error);
		res.status(500).json({ success: false, message: "Error Signing up user" });
	}
};

/**
 * Middleware to generate a JSON Web Token (JWT) for a user.
 * @param {object} user - User object.
 * @returns {string} JWT token.
 */
function generateAuthToken(user) {
	const payload = {
		userId: user._id, // Use the user's _id from MongoDB
	};
	const secretKey = process.env.JWT_SECRET_KEY;
	const token = jwt.sign(payload, secretKey);
	return token;
}

/**
 * Middleware to handle user login.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Find the user by email
		const user = await User.findOne({ userEmail: email });

		// Check if the user exists
		if (!user) {
			return res.status(404).json({ success: false, message: "User Not Found" });
		}

		// Compare the provided password with the hashed password
		bcrypt.compare(password, user.userPassword, function (err, result) {
			if (result) {
				// Generate a JWT token and send a successful response
				const jwtToken = generateAuthToken(user);
				return res.status(200).json({
					message: "Logged in successfully",
					success: true,
					encryptedId: jwtToken,
					isPremium: user.isPremium,
				});
			}

			// Handle password mismatch and user not found
			if (!result) {
				if (email === user.userEmail) {
					return res.status(401).json({ message: "Password Mismatch", success: false });
				} else {
					return res.status(404).json({ message: "User Not Found", success: false });
				}
			}
		});
	} catch (error) {
		console.error("Error in user login:", error);
		res.status(500).json({ success: false, message: "Error occurred while logging in" });
	}
};
