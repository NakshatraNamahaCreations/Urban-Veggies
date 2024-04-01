const UserModal = require("../Modal/auth/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const express = require("express");
const router = express.Router();

router.post("/addadmin", async (req, res) => {
  let { username, email, password, cpassword } = req.body;

  if (password !== cpassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const token = generateToken();

    const userData = new UserModal({
      username,
      email,
      password: hashedPassword,
      cpassword: hashedPassword,
      token: token,
    });

    const savedUser = await userData.save();

    if (savedUser) {
      return res
        .status(200)
        .json({ message: "Admin Added Successfully", savedUser });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
});

function generateToken() {
  const token = jwt.sign({}, "ecomadmin#123456789", {
    expiresIn: "1h",
  });
  return token;
}

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModal.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid Email or Password!" });
    }

    const isMatched = await user.comparePassword(password);

    if (!isMatched) {
      return res.status(401).json({ error: "Invalid Email or Password!" });
    }

    const token = generateToken(user);
    console.log(token, "token");
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal error" });
  }
});

router.post("/logout", async (req, res) => {
  let { token } = req.body;
  try {
    if (!token) {
      return res.status(400).json({ error: "Token is required for logout" });
    }

    const existingToken = await UserModal.findOne({ token });

    if (existingToken) {
      return res.status(200).json({ message: "Token is already blacklisted" });
    }

    await UserModal.create({ token });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
