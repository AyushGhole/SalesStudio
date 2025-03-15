const User = require("../models/User"); // FIXED: Correct import
const httpStatus = require("http-status");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" } //  Set expiration time
      );

      user.token = token;
      await user.save();

      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Register Function
const register = async (req, res) => {
  const { name, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name,
      username: username,
      password: hashedPassword,
    });

    await newUser.save();
    res.json({ message: "User Created Successfully!" });
  } catch (err) {
    console.error("Registration Error:", err);
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

module.exports = { login, register };
