//importing libraries
const jwt = require("jsonwebtoken");

//imporitng models
const User = require("../models/userModel");

//middlware functions

//to authenticate a user
exports.authenticateToken = async (req, res, next) => {
  console.log("authentication started");
  const token = req.headers.authorization;
  console.log(token);
  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    const decodedId = jwt.verify(token, secretKey);
    const loggedInUserData = await User.findByPk(decodedId);
    const user = loggedInUserData.dataValues;
    req.user = user;
    console.log(req.user);
    next();
  } catch (error) {
    res.status(500).json({ error: "Error in the Authentication" });
  }
};
