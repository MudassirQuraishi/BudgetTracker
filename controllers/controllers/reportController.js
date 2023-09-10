const Expense = require("../models/expenseModel");
const Reports = require("../models/fileReportsModel");

const AWS = require("aws-sdk");
const sequelize = require("../utilities/database");

function uploadToS3(data, name) {
  const BUCKET_NAME = process.env.AWS_EXPENSE_FILE_BUCKET;
  const IAM_USER_KEY = process.env.AWS_ACCESS_KEY;
  const IAM_USER_SECRET = process.env.AWS_SECRET_KEY;
  const ACL_ACCESS = process.env.AWS_ACCESS_STATUS;
  let s3Bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  });
  const params = {
    Bucket: BUCKET_NAME,
    Key: name,
    Body: data,
    ACL: ACL_ACCESS,
  };
  return new Promise((res, rej) => {
    s3Bucket.upload(params, (err, s3Response) => {
      if (err) {
        rej(err);
      } else {
        res(s3Response);
      }
    });
  });
}

exports.downloadReport = async (req, res) => {
  const t = await sequelize.transaction();
  console.log(req.user);
  try {
    const userExpenses = await Expense.findAll(
      {
        where: { UserId: req.user.id },
      },
      { transaction: t }
    );
    const stringifiedData = JSON.stringify(userExpenses);
    const fileName = `Expenses_${req.user.id}_${new Date()} `;
    const fileURL = await uploadToS3(stringifiedData, fileName);
    await Reports.create(
      {
        fileUrl: fileURL.Location,
        UserId: req.user.id,
      },
      { transaction: t }
    );
    await t.commit();
    res.status(200).json({ fileURL: fileURL, success: true });
  } catch (err) {
    await t.rollback();
    console.log(err);
    res.status(500).json({ success: false });
  }
};

exports.showReports = async (req, res) => {
  try {
    const response = await Reports.findAll({
      where: { UserId: req.user.id },
      attributes: ["fileUrl", "createdAt"],
    });
    res.status(200).json({
      success: true,
      message: "Succesfully retrieved files",
      response,
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};
