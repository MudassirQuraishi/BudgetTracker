const Expense = require("../models/expenseModel");
const Reports = require("../models/fileReportsModel");
const AWS = require("aws-sdk");
const mongoose = require("mongoose");

const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET_KEY,
});

/**
 * Upload data to AWS S3.
 * @param {Buffer | string} data - Data to be uploaded.
 * @param {string} name - Name of the file.
 * @returns {Promise<Object>} AWS S3 response.
 */
function uploadToS3(data, name) {
	const BUCKET_NAME = process.env.AWS_EXPENSE_FILE_BUCKET;
	const ACL_ACCESS = process.env.AWS_ACCESS_STATUS;
	const params = {
		Bucket: BUCKET_NAME,
		Key: name,
		Body: data,
		ACL: ACL_ACCESS,
	};
	return new Promise((resolve, reject) => {
		s3.upload(params, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}

/**
 * Middleware function to download a report and store it in S3.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
exports.downloadReport = async (req, res) => {
	try {
		const userExpenses = await Expense.find({ user: req.user._id });
		const stringifiedData = JSON.stringify(userExpenses);
		const fileName = `Expenses_${req.user._id}_${new Date()}.json`;
		const fileURL = await uploadToS3(stringifiedData, fileName);
		await Reports.create({
			fileUrl: fileURL.Location,
			userId: req.user._id,
		});
		res.status(200).json({ fileURL, success: true });
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false });
	}
};

/**
 * Middleware function to show reports associated with the user.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
exports.showReports = async (req, res) => {
	try {
		const reports = await Reports.find({ userId: req.user._id }, "fileUrl createdAt");
		res.status(200).json({ success: true, message: "Successfully retrieved files", response: reports });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false });
	}
};
