const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// ================= CREATE =================
exports.createHelpAndSupport = async (req, res, next) => {

  try {

    const {
      name,
      email,
      phonenumber,
      role
    } = req.body;

    // validation
    if (!name || !email || !phonenumber || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // insert
    const [result] = await db.query(
      `INSERT INTO helpandsupport
      (name, email, phonenumber, role)
      VALUES (?, ?, ?, ?)`,
      [name, email, phonenumber, role]
    );

    return res.status(201).json({
      success: true,
      message: "Help & Support created successfully",
      id: result.insertId
    });

  } catch (err) {

    next(err);

  }

};


// ================= GET ALL =================
exports.getHelpAndSupport = async (req, res, next) => {

  try {

    const [rows] = await db.query(
      "SELECT * FROM helpandsupport ORDER BY id DESC"
    );

    return res.status(200).json({
      success: true,
      total: rows.length,
      data: rows
    });

  } catch (err) {

    next(err);

  }

};


// ================= GET BY ID =================
exports.getHelpAndSupportById = async (req, res, next) => {

  try {

    const [rows] = await db.query(
      "SELECT * FROM helpandsupport WHERE id=?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0]
    });

  } catch (err) {

    next(err);

  }

};


// ================= UPDATE =================
exports.updateHelpAndSupport = async (req, res, next) => {

  try {

    const {
      name,
      email,
      phonenumber,
      role
    } = req.body;

    // validation
    if (!name || !email || !phonenumber || !role) {

      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });

    }

    // update
    const [result] = await db.query(
      `UPDATE helpandsupport
       SET name=?, email=?, phonenumber=?, role=?
       WHERE id=?`,
      [
        name,
        email,
        phonenumber,
        role,
        req.params.id
      ]
    );

    // not found
    if (result.affectedRows === 0) {

      return res.status(404).json({
        success: false,
        message: "Help & Support not found"
      });

    }

    return res.status(200).json({
      success: true,
      message: "Help & Support updated successfully"
    });

  } catch (err) {

    next(err);

  }

};


// ================= DELETE =================
exports.deleteHelpAndSupport = async (req, res, next) => {

  try {

    const [result] = await db.query(
      "DELETE FROM helpandsupport WHERE id=?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {

      return res.status(404).json({
        success: false,
        message: "Help & Support not found"
      });

    }

    return res.status(200).json({
      success: true,
      message: "Deleted successfully"
    });

  } catch (err) {

    next(err);

  }

};