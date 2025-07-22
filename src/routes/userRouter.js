const { Router } = require("express");
const userRouter = Router();
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const key = "#479@/^5149*@123";
const userModel = require("../models/userModel");
const auth = require("../middleware/auth");
const { roles } = require("../utils/constant");
global.verificationCodes = global.verificationCodes || {};

setInterval(() => {
  if (global.verificationCodes) {
    Object.keys(global.verificationCodes).forEach((email) => {
      if (Date.now() > global.verificationCodes[email].expires) {
        delete global.verificationCodes[email];
      }
    });
  }
}, 5 * 60 * 1000);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "grapsuperapp@gmail.com",
    pass: "jtim dtvp edkz kwnx",
  },
});

const validateEmailDomain = (email) => {
  const commonDomains = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "icloud.com",
    "protonmail.com",
    "aol.com",
    "mail.com",
    "zoho.com",
    "yandex.com",
    "live.com",
    "msn.com",
    "rediffmail.com",
    "fastmail.com",
    "edu",
  ];
  const domain = email.split("@")[1];
  return commonDomains.some(
    (validDomain) =>
      domain.toLowerCase().includes(validDomain) ||
      domain.toLowerCase().endsWith(".edu") ||
      domain.toLowerCase().endsWith(".org") ||
      domain.toLowerCase().endsWith(".gov")
  );
};

const verifyEmailExists = async (email) => {
  try {
    const verificationCode = crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase();

    const mailOptions = {
      from: "grapsuperapp@gmail.com",
      to: email,
      subject: "Grap SuperApp - Email Verification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Grap SuperApp!</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; color: #333; border-radius: 5px;">
            ${verificationCode}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, code: verificationCode };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

userRouter.post("/register", async (req, res) => {
  const { email, password, phone, userName, type } = req.body;
  try {
    if (!validator.isEmail(email)) return res.status(400).json({ message: "Invalid email" });
    if (!validateEmailDomain(email)) return res.status(400).json({ message: "Use common email domain" });
    if (password.length < 6) return res.status(400).json({ message: "Password too short" });
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/.test(password))
      return res.status(400).json({ message: "Weak password" });
    if (!/^[6-9]\d{9}$/.test(phone.replace(/[\s\-\(\)]/g, "")))
      return res.status(400).json({ message: "Invalid phone" });
    if (!validator.isMobilePhone(phone, "en-IN")) return res.status(400).json({ message: "Phone required" });

    const existingUser = await userModel.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User exists" });

    const emailVerification = await verifyEmailExists(email);
    if (!emailVerification.success) return res.status(400).json({ message: "Email issue", type: "email_not_exists" });

    global.verificationCodes[email] = {
      code: emailVerification.code,
      userData: { email, password, phone, userName, type },
      expires: Date.now() + 10 * 60 * 1000,
    };

    return res.status(200).json({
      message: "Verification code sent",
      email,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal error" });
  }
});

userRouter.post("/verify-email", async (req, res) => {
  const { email, verificationCode } = req.body;
  try {
    const stored = global.verificationCodes[email];
    if (!stored || Date.now() > stored.expires)
      return res.status(400).json({ message: "Code expired or not found" });

    if (stored.code !== verificationCode.toUpperCase())
      return res.status(400).json({ message: "Wrong code" });

    const { password, phone, userName, type } = stored.userData;
    const roleMap = {
      user: roles.user,
      restaurant: roles.restaurant,
      mart: roles.mart,
      driver: roles.driver,
      porter: roles.porter,
    };
    const role = roleMap[type] || roles.user;

    bcrypt.hash(password, 8, async (err, hash) => {
      if (err) return res.status(400).json({ message: "Hash error" });
      const user = await userModel.create({
        email,
        password: hash,
        phone,
        userName,
        role,
        emailVerified: true,
      });
      delete global.verificationCodes[email];
      return res.status(201).json({
        message: "Email verified and account created",
        user: user._id,
        role: user.role,
      });
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal error" });
  }
});

module.exports = userRouter;
