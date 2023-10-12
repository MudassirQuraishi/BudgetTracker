const User = require("../models/userModel");

// Middleware function to show the leaderboard
exports.showLeaderboard = async (req, res) => {
	try {
		const allUsers = await User.find({}, "userName totalExpense").exec();

		// Sort the usersArray by totalExpense in descending order
		allUsers.sort((a, b) => b.totalExpense - a.totalExpense);

		res.status(200).json({ success: true, leaderboardData: allUsers });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Error showing leaderboard" });
	}
};

// Middleware function to show the user's dashboard
exports.showDashboard = async (req, res) => {
	try {
		const response = await User.findById(req.user._id, "income totalExpense").exec();
		res.status(200).json({ success: true, data: response });
	} catch (error) {
		console.log("Error showing dashboard:", error);
		res.status(500).json({ error: "Error showing dashboard" });
	}
};
