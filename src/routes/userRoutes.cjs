// userRouter.js
const { Router } = require("express");
const userRouter = Router();
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const key = "#479@/^5149*@123";
const userModel = require("../models/userModel");
const auth = require("../middleware/auth.cjs");
const { roles } = require("../utils/constant.cjs");

global.verificationCodes = global.verificationCodes || {};
setInterval(() => {
  Object.keys(global.verificationCodes).forEach((email) => {
    if (Date.now() > global.verificationCodes[email].expires) {
      delete global.verificationCodes[email];
    }
  });
}, 5 * 60 * 1000);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sneelesh182@gmail.com",
    pass: "jtim dtvp edkz kwnx",
  },
});

const validateEmailDomain = (email) => {
  const commonDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "protonmail.com", "aol.com", "mail.com", "zoho.com", "yandex.com", "live.com", "msn.com", "rediffmail.com", "fastmail.com", "edu"];
  const domain = email.split("@")[1];
  return commonDomains.some((d) => domain.includes(d) || domain.endsWith(".edu") || domain.endsWith(".org") || domain.endsWith(".gov"));
};

const verifyEmailExists = async (email) => {
  try {
    const code = crypto.randomBytes(3).toString("hex").toUpperCase();
    await transporter.sendMail({
      from: "sneelesh182@gmail.com",
      to: email,
      subject: "Grap SuperApp - Email Verification",
      html: `<h2>Welcome to Grap!</h2><p>Your verification code is: <b>${code}</b></p>`
    });
    return { success: true, code };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

userRouter.post("/register", async (req, res) => {
  const { email, password, phone, userName, role } = req.body;
  try {
    if (!validator.isEmail(email)) return res.status(400).json({ message: "Invalid email" });
    if (!validateEmailDomain(email)) return res.status(400).json({ message: "Unsupported email domain" });
    if (password.length < 6 || !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/.test(password))
      return res.status(400).json({ message: "Weak password" });
    if (!/^[6-9]\d{9}$/.test(phone)) return res.status(400).json({ message: "Invalid Indian phone" });

    const existing = await userModel.findOne({ email });
    if (existing) return res.status(400).json({ message: "User exists" });

    const emailCheck = await verifyEmailExists(email);
    if (!emailCheck.success) return res.status(400).json({ message: "Email failed" });

    global.verificationCodes[email] = {
      code: emailCheck.code,
      userData: { email, password, phone, userName, role },
      expires: Date.now() + 10 * 60 * 1000,
    };
    res.status(200).json({ message: "Code sent", email });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

userRouter.post("/verify-email", async (req, res) => {
  const { email, verificationCode } = req.body;
  const stored = global.verificationCodes[email];
  if (!stored || stored.code !== verificationCode.toUpperCase() || Date.now() > stored.expires) {
    return res.status(400).json({ message: "Invalid or expired code" });
  }

  const { password, phone, userName, role } = stored.userData;
  const hashed = await bcrypt.hash(password, 8);
  const user = await userModel.create({
    email,
    password: hashed,
    phone,
    userName,
    role: roles[role] || roles.user,
    emailVerified: true,
  });
  delete global.verificationCodes[email];
  res.status(201).json({ message: "Verified", user: user._id });
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user || !user.activity) return res.status(403).json({ message: "Inactive or not found" });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Wrong credentials" });
  const token = jwt.sign({ email, id: user._id, userName: user.userName }, key);
  res.status(200).json({ token, user: user._id, role: user.role });
});

userRouter.get("/all", async (req, res) => {
  const users = await userModel.find({});
  res.status(200).json(users);
});

userRouter.patch("/update-role/:id", async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  await userModel.findByIdAndUpdate(id, { role });
  res.status(200).json({ message: `Role updated to ${role}` });
});

userRouter.patch("/toggle-activity/:id", async (req, res) => {
  const user = await userModel.findById(req.params.id);
  user.activity = !user.activity;
  await user.save();
  res.status(200).json({ message: `User ${user.activity ? "Enabled" : "Disabled"}` });
});

module.exports = userRouter;
