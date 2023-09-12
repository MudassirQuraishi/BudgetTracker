//importing libraries
const jwt = require("jsonwebtoken");

//imporitng models
const User = require("../models/userModel");

//middlware functions

//to authenticate a user
exports.authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    const decodedId = jwt.verify(token, secretKey);
    const loggedInUserData = await User.findByPk(decodedId);
    const user = loggedInUserData.dataValues;
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: "Error in the Authentication" });
  }
};
