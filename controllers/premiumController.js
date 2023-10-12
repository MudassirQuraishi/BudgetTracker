const User = require("../models/userModel");

/**
 * Middleware to show the leaderboard.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
exports.showLeaderboard = async (req, res) => {
	try {
		const allUsers = await User.find({}, "userName totalExpense").exec();

		// Sort the usersArray by totalExpense in descending order
		allUsers.sort((a, b) => b.totalExpense - a.totalExpense);

		res.status(200).json({ success: true, leaderboardData: allUsers });
	} catch (error) {
		console.error("Error showing leaderboard:", error);
		res.status(500).json({ success: false, error: "Error showing leaderboard" });
	}
};

/**
 * Middleware to show the user's dashboard.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
exports.showDashboard = async (req, res) => {
	try {
		const response = await User.findById(req.user._id, "income totalExpense").exec();
		if (!response) {
			return res.status(404).json({ success: false, message: "User not found" });
		}
		res.status(200).json({ success: true, data: response });
	} catch (error) {
		console.error("Error showing dashboard:", error);
		res.status(500).json({ success: false, error: "Error showing dashboard" });
	}
};
