//imporitng models
const User = require("../models/userModel");

//middleware functions

//to show leaderboard
exports.showLeaderboard = async (req, res, next) => {
  try {
    const allUsers = await User.findAll({
      attributes: ["id", "userName", "totalExpense"],
    });
    const usersArray = allUsers.map((User) => ({
      data: User.dataValues,
    }));

    usersArray.sort((a, b) => b.data.totalExpense - a.data.totalExpense);
    console.log(usersArray);
    res.status(200).json({ success: true, leaderboardData: usersArray });
  } catch (error) {
    res.status(500).json({ error: "Error showing leaderboard" });
  }
};
exports.showDashboard = async (req, res) => {
  try {
    const response = await User.findOne({
      where: { id: req.user.id },
      attributes: ["income", "totalExpense"],
    });
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.log("error showing dashboard");
    res.status(500).json({ error: "Error showing dashboard" });
  }
};
