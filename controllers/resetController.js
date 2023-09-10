//importing libraries
const bcrypt = require("bcrypt");
var sib = require("sib-api-v3-sdk");
const uuid = require("uuid");

//importing models
const User = require("../models/userModel");
const ForogotPassword = require("../models/passwordResetModel");

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const check = await User.findOne({ where: { email: email } });

  if (check) {
    const id = uuid.v4();
    const createRequest = await ForogotPassword.create({
      uuid: id,
      isActive: true,
      UserId: check.dataValues.id,
    });

    try {
      const defaultClient = sib.ApiClient.instance;

      const apiKey = defaultClient.authentications["api-key"];
      apiKey.apiKey = process.env.BREVO_API_KEY;

      const apiInstance = new sib.TransactionalEmailsApi();

      const sender = {
        email: "mudassir.quraishi14@outlook.com",
        name: "Expense Tracker",
      };
      const recievers = [
        {
          email: req.body.email,
        },
      ];
      const data = await apiInstance.sendTransacEmail({
        sender,
        to: recievers,
        subject: "Reset Password",
        textContent: `http://localhost:3000/password/reset-password/{{params.uuid}}`,
        htmlContent: `<h1>Expense Tracker App</h1>
        <p>Hi there! Reset the Expense Tracker APP password for your account with email</p>
        <a href="http://localhost:3000/password/reset-password/{{params.uuid}}">Reset Password</a>`,
        params: {
          uuid: id,
        },
      });
      res
        .status(200)
        .json({ success: true, message: "Email sent successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Email cannot be sent" });
    }
  } else {
    res.status(500).json({ success: false, message: "Email not found" });
  }
};

exports.resetPassword = async (req, res, next) => {
  const id = req.params.id;
  const user = await ForogotPassword.findOne({ where: { uuid: id } });
  if (user.dataValues.isActive) {
    await ForogotPassword.update({ isActive: false }, { where: { uuid: id } });
    res.status(200).send(`<html>
    <script>
    function formsubmitted(e){
      e.preventDefault();
      console.log('called')
      }
      </script>
      <form action="/password/update-password/${id}" method="get">
          <label for="newPassword">Enter New password</label>
          <input name="newPassword" type="password" required></input>
          <button>reset password</button>
      </form>
  </html>`);
    return res.end();
  } else {
    res.json({
      message: "Ivalid Link",
    });
  }
};

exports.updatePassword = async (req, res, next) => {
  const { newPassword } = req.query;
  const { id } = req.params;
  const passwordRequest = await ForogotPassword.findOne({
    where: { uuid: id },
  });
  const requestedUser = await User.findOne({
    where: { id: passwordRequest.dataValues.UserId },
  });
  if (requestedUser) {
    const saltRounds = 10;
    bcrypt.hash(newPassword, saltRounds, async (err, hash) => {
      if (err) {
        console.log(err);
        return;
      }
      const updatedPassword = requestedUser.update({
        password: hash,
      });
    });
  }
  res.status(200).json({ success: true });
};
