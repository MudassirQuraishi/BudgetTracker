const bcrypt = require("bcrypt");
const sib = require("sib-api-v3-sdk");
const uuid = require("uuid");
const axios = require("axios");

const User = require("../models/userModel");
const ForgotPassword = require("../models/passwordResetModel");

// Initialize the SendinBlue API client
const defaultClient = sib.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

const transacEmailApi = new sib.TransactionalEmailsApi();

/**
 * Function to send a password reset email using SendinBlue.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
exports.forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const uuidToken = uuid.v4(); // Generate a unique token

		// Save the reset request in the database
		const resetRequest = new ForgotPassword({ uuid: uuidToken, isActive: true });
		await resetRequest.save();

		// Compose and send the email using SendinBlue
		const sender = new sib.SendSmtpEmailSender();
		sender.email = "hr@recur.com";
		sender.name = "HR";

		const to = [new sib.SendSmtpEmailTo()];
		to[0].email = email;

		const sendSmtpEmail = new sib.SendSmtpEmail();
		sendSmtpEmail.sender = sender;
		sendSmtpEmail.to = to;
		sendSmtpEmail.subject = "Password Reset Request";
		sendSmtpEmail.textContent = `Click the following link to reset your password: 
    http://your-app-url/reset-password/${uuidToken}`;

		const sendEmailResponse = await transacEmailApi.sendTransacEmail({ sendSmtpEmail });

		res.status(200).json({ success: true, message: "Email sent successfully" });
	} catch (error) {
		console.error("Error in sending password reset email:", error);
		res.status(500).json({ success: false, message: "Email cannot be sent" });
	}
};

/**
 * Function to render a reset password form.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
exports.resetPassword = async (req, res) => {
	const id = req.params.id;
	const resetRequest = await ForgotPassword.findOne({ uuid: id });

	if (resetRequest.isActive) {
		res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.4/axios.min.js"></script>
          <title>Reset Password</title>
        </head>
        <body>
          <form action="">
            <label for="newPassword">New Password:</label>
            <input type="password" id="password" name="newPassword">
            <button type="submit" id="reset-button">Reset Password</button>
          </form>
          <script>
            const resetButton = document.getElementById("reset-button");
            const newPassword = document.getElementById("password");
            const id = "${id}";
            resetButton.addEventListener("click", async (e) => {
              e.preventDefault();
              const newPasswordValue = newPassword.value;
              if (!newPasswordValue) return;
              axios.post("/reset-password/" + id, { newPassword: newPasswordValue })
                .then((response) => {
                  if (response.status === 200) {
                    window.location.href = "../../Login/login.html";
                  }
                })
                .catch((error) => {
                  console.error("Error resetting password:", error);
                });
            });
          </script>
        </body>
      </html>
    `);
	} else {
		res.json({
			message: "Invalid Link",
		});
	}
};

/**
 * Function to update the password.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
exports.updatePassword = async (req, res) => {
	const { newPassword } = req.body;
	const { id } = req.params;

	const resetRequest = await ForgotPassword.findOne({ uuid: id });

	if (resetRequest.isActive) {
		// Hash the new password and update the user's password
		bcrypt.hash(newPassword, 10, async (err, hash) => {
			if (err) {
				console.error("Error hashing password:", err);
				res.status(500).json({
					success: false,
					message: "Error updating password",
				});
			} else {
				// Find the user and update the password
				const user = await User.findOne({ _id: resetRequest.UserId });
				user.password = hash;
				await user.save();

				// Deactivate the reset request
				resetRequest.isActive = false;
				await resetRequest.save();

				res.status(200).json({
					success: true,
					message: "Password updated successfully",
				});
			}
		});
	} else {
		res.status(404).json({ message: "Invalid Link" });
	}
};
