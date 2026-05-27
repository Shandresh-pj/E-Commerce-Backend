const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");


// ================= REGISTER =================
exports.register = async (req, res, next) => {

  try {

    const { name, email, password } = req.body;

    // validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, Email and Password are required"
      });
    }

    // image optional
    let image = null;

    // if image uploaded
    if (req.file) {
      image = req.file.filename;
    }

    // check email exists
    const [user] = await db.query(
      "SELECT * FROM registration WHERE email = ?",
      [email]
    );

    if (user.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert user
    const [result] = await db.query(
      "INSERT INTO registration (name, email, password, image, status) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, image, "Active"]
    );

    res.status(201).json({
      success: true,
      message: "Register successfully",
      Id: result.insertId,
      image
    });

  } catch (err) {
    next(err);
  }
};
// ================= LOGIN =================
exports.login = async (req, res, next) => {

  try {

    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email & password required"
      });
    }

    // check email
    const [rows] = await db.query(
      "SELECT * FROM registration WHERE email = ?",
      [email]
    );

    // email not found
    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid email"
      });
    }

    const user = rows[0];

    // compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    // wrong password
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password"
      });
    }

    // access token
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h"
      }
    );

    // success response
    return res.status(200).json({
      success: true,
      message: "Login success",
      // accessToken,

      // user: {
      //   id: user.id,
      //   name: user.name,
      //   email: user.email
      // }
    });

  } catch (err) {

    next(err);

  }

};