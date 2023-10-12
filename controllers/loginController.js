//importing libraries
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//importing models
const User = require("../models/userModel");

//midddleware fucntions

//for signup
exports.signup = async (req, res) => {
	try {
		const saltRounds = 10;
		const { password, email } = req.body;
		const hash = await bcrypt.hash(password, saltRounds);

		const existingUser = await User.findOne({ userEmail: email });
		if (existingUser) {
			res.status(201).json({ success: true, messgae: "User Already exists" });
		}
		const user = await User.create({
			userName: req.body.name,
			userEmail: req.body.email,
			userPassword: hash,
		});
		console.log(user);
		res.status(200).json({ success: true, message: "User created successfully" });
	} catch (err) {
		res.status(500).json({ sucess: false, message: "Error Signing up user" });
	}
};

// //to generate token
function generateAuthToken(user) {
	const payload = {
		userId: user._id, // Use the user's _id from MongoDB
	};
	const secretKey = process.env.JWT_SECRET_KEY;
	const token = jwt.sign(payload, secretKey);
	return token;
}
//for login
exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ userEmail: email });

		if (!user) {
			res.status(404).json({ success: false, message: "User Not Found" });
		}
		const jwtToken = generateAuthToken(user);
		bcrypt.compare(password, user.userPassword, function (err, result) {
			if (result) {
				res.status(200).json({
					message: "logged in successfully",
					success: true,
					encryptedId: jwtToken,
					isPremium: user.isPremium,
				});
			}
			if (!result) {
				if (email === user.email) {
					res.status(401).json({ message: "password mismatch", success: false });
				} else {
					res.status(404).json({ message: "User not found" });
				}
			}
		});
	} catch (error) {
		res.status(500).json({ error: "Error occured while logging In" });
	}
};
