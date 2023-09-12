//importing models
const Expense = require("../models/expenseModel");
const User = require("../models/userModel");

//importing sequelize
const sequelize = require("../utilities/database");

//middleware functions

//to save expense
exports.saveDataToDatabase = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const data = await Expense.create(
      {
        description: req.body.description,
        price: req.body.amount,
        category: req.body.category,
        UserId: req.user.id,
      },
      { transaction: t }
    );
    const check = await User.update(
      {
        totalExpense: sequelize.literal(`totalExpense + ${req.body.amount}`),
      },
      { where: { id: req.user.id }, transaction: t }
    );
    await t.commit();
    res
      .status(201)
      .json({ success: true, message: "Succesfully added Expense", data });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: "Error Adding Expense To The Database" });
  }
};

//to delete expense
exports.deleteFromDatabase = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;
    const price = await Expense.findOne(
      {
        where: { id: id },
        attributes: ["price"],
      },
      { transaction: t }
    );
    const deletionAmount = price.dataValues.price;
    const data = await Expense.destroy(
      { where: { id: id } },
      { transaction: t }
    );
    const check = await User.update(
      {
        totalExpense: sequelize.literal(`totalExpense - ${deletionAmount}`),
      },
      { where: { id: req.user.id }, transaction: t }
    );
    await t.commit();
    res.status(200).json({ success: true, message: "Deletion successful" });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: "Error Deleting Data From the Data Base" });
  }
};

//to edit expense
exports.editDataInDatabase = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;

    const oldP = await Expense.findOne(
      {
        where: { id: id },
        attributes: ["price"],
      },
      { transaction: t }
    );
    const oldPrice = oldP.dataValues.price;
    const newPrice = req.body.price;
    const effectivePrice = oldPrice - newPrice;
    const data = await Expense.update(
      {
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
      },

      { where: { id: id }, transaction: t }
    );
    const check = await User.update(
      {
        totalExpense: sequelize.literal(`totalExpense - ${effectivePrice}`),
      },
      { where: { id: req.user.id }, transaction: t }
    );

    const updatedData = await Expense.findByPk(id, { transaction: t });
    await t.commit();
    res.status(200).json(updatedData.dataValues);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: "Error Editing Data from the Database" });
  }
};

//to get all the data when page refresh happens
exports.getAllDataFromDatabase = async (req, res) => {
  try {
    const dbData = await Expense.findAll({ where: { UserId: req.user.id } });
    const data = dbData.map((data) => data.dataValues);
    res.status(201).json(data);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error retrieving all data from the database" });
  }
};
exports.getPaginatedData = async (req, res) => {
  const currentpage = JSON.parse(req.query.page) || 1;
  const limit = JSON.parse(req.query.count) || 3;
  const totalExpenses = await Expense.count({ where: { UserId: req.user.id } });
  const pageData = await Expense.findAll({
    offset: (currentpage - 1) * limit,
    limit: limit,
    where: { UserId: req.user.id },
  });
  const responseData = {
    pageData: pageData,
    currentpage: currentpage,
    nextPage: currentpage + 1,
    hasNextPage: limit * currentpage < totalExpenses,
    previousPage: currentpage - 1,
    hasPreviousPage: currentpage > 1,
    lastPage: Math.ceil(totalExpenses / limit),
  };

  res.status(200).json({
    success: true,
    message: "Succcessfully retrieved data.",
    data: responseData,
  });
};

exports.addIncome = async (req, res) => {
  try {
    const response = await User.update(
      {
        income: req.body.amount,
      },
      {
        where: { id: req.user.id },
      }
    );
    res
      .status(200)
      .json({ success: true, message: "income added successfully", response });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Adding Income" });
  }
};
