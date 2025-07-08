
const { Router } = require("express");
const userRouter = Router();
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const key = "#479@/^5149*@123";
const userModel = require("../models/userModel");
// const menuModel = require('../models/menuModel')
const auth = require("../middleware/auth");
const { roles } = require("../utils/constant");
global.verificationCodes = global.verificationCodes || {};

setInterval(() => {
  if (global.verificationCodes) {
    Object.keys(global.verificationCodes).forEach((email) => {
      if (Date.now() > global.verificationCodes[email].expires) {
        console.log(`Cleaning up expired verification code for: ${email}`);
        delete global.verificationCodes[email];
      }
    });
  }
}, 5 * 60 * 1000);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sneelesh182@gmail.com",
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
      from: "sneelesh182@gmail.com",
      to: email,
      subject: "Vasu Cafe - Email Verification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Vasu Cafe!</h2>
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
    console.error("Email verification error:", error);
    return { success: false, error: error.message };
  }
};
userRouter.post("/register", async (req, res) => {
  const { email, password, phone, userName } = req.body;
  try {
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }
    if (!validateEmailDomain(email)) {
      return res.status(400).json({
        message:
          "Please use a valid email service provider (Gmail, Yahoo, Outlook, etc.)",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must contain at least one letter and one number",
      });
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""))) {
      return res.status(400).json({
        message: "Please enter a valid 10-digit Indian phone number",
      });
    }
    if (!validator.isMobilePhone(phone, "en-IN")) {
      return res.status(400).json({
        message: "Please enter a valid phone number",
      });
    }

    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists. Please login",
      });
    }

    // Verify email exists and send verification code
    const emailVerification = await verifyEmailExists(email);
    if (!emailVerification.success) {
      return res.status(400).json({
        message:
          "Email address does not exist or cannot receive emails. Please check and try again.",
        type: "email_not_exists",
      });
    }

    // Store user data temporarily for verification
    global.verificationCodes[email] = {
      code: emailVerification.code,
      userData: { email, password, phone, userName },
      expires: Date.now() + 10 * 60 * 1000, // 10 minutes
    };

    return res.status(200).json({
      message:
        "Verification code sent to your email. Please verify to complete registration.",
      email: email,
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.post("/verify-email", async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    if (!global.verificationCodes || !global.verificationCodes[email]) {
      return res.status(400).json({
        message:
          "Verification code expired or not found. Please try registering again.",
      });
    }

    const storedData = global.verificationCodes[email];

    if (Date.now() > storedData.expires) {
      delete global.verificationCodes[email];
      return res.status(400).json({
        message: "Verification code expired. Please try registering again.",
      });
    }

    if (storedData.code !== verificationCode.toUpperCase()) {
      return res.status(400).json({
        message: "Invalid verification code. Please try again.",
      });
    }

    const { email: userEmail, password, phone, userName } = storedData.userData;
    const role = userEmail === "sneelesh182@gmail.com" ? roles.admin : roles.user;

    bcrypt.hash(password, 8, async (err, hash) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "An error occurred. Please try again later" });
      }

      const user = await userModel.create({
        email: userEmail,
        password: hash,
        phone: phone,
        userName: userName,
        role: role,
        emailVerified: true,
      });

      delete global.verificationCodes[email];

      return res.status(201).json({
        message: "Registration successful! Your email has been verified.",
        user: user._id,
      });
    });
  } catch (err) {
    console.error("Email verification error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.post("/resend-verification", async (req, res) => {
  const { email } = req.body;

  try {
    if (!global.verificationCodes || !global.verificationCodes[email]) {
      return res.status(400).json({
        message: "No pending verification found. Please try registering again.",
      });
    }

    const emailVerification = await verifyEmailExists(email);
    if (!emailVerification.success) {
      return res.status(400).json({
        message: "Email address does not exist or cannot receive emails.",
      });
    }

    global.verificationCodes[email].code = emailVerification.code;
    global.verificationCodes[email].expires = Date.now() + 10 * 60 * 1000;

    return res.status(200).json({
      message: "New verification code sent to your email.",
    });
  } catch (err) {
    console.error("Resend verification error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    const existingUser = await userModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(400).json({
        message: "No account found with this email address",
      });
    }

    // Send verification code for password reset
    const emailVerification = await verifyEmailExists(email);
    if (!emailVerification.success) {
      return res.status(400).json({
        message: "Unable to send verification code. Please try again later.",
      });
    }

    // Store verification code for password reset
    global.verificationCodes[email] = {
      code: emailVerification.code,
      type: "password_reset",
      expires: Date.now() + 10 * 60 * 1000, // 10 minutes
    };

    return res.status(200).json({
      message: "Verification code sent to your email for password reset.",
      email: email,
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Verify forgot password code
userRouter.post("/verify-forgot-password", async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    if (!global.verificationCodes || !global.verificationCodes[email]) {
      return res.status(400).json({
        message: "Verification code expired or not found. Please try again.",
      });
    }

    const storedData = global.verificationCodes[email];

    if (Date.now() > storedData.expires) {
      delete global.verificationCodes[email];
      return res.status(400).json({
        message: "Verification code expired. Please try again.",
      });
    }

    if (storedData.code !== verificationCode.toUpperCase()) {
      return res.status(400).json({
        message: "Invalid verification code. Please try again.",
      });
    }

    if (storedData.type !== "password_reset") {
      return res.status(400).json({
        message: "Invalid verification type.",
      });
    }

    // Mark as verified for password reset
    global.verificationCodes[email].verified = true;
    global.verificationCodes[email].expires = Date.now() + 5 * 60 * 1000; // Extend by 5 minutes for password reset

    return res.status(200).json({
      message: "Verification successful. You can now reset your password.",
    });
  } catch (err) {
    console.error("Forgot password verification error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Reset Password
userRouter.post("/reset-password", async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  try {
    if (!global.verificationCodes || !global.verificationCodes[email]) {
      return res.status(400).json({
        message:
          "Session expired. Please start the password reset process again.",
      });
    }

    const storedData = global.verificationCodes[email];

    if (Date.now() > storedData.expires) {
      delete global.verificationCodes[email];
      return res.status(400).json({
        message:
          "Session expired. Please start the password reset process again.",
      });
    }

    if (!storedData.verified || storedData.type !== "password_reset") {
      return res.status(400).json({
        message: "Unauthorized. Please verify your email first.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: "Password must contain at least one letter and one number",
      });
    }

    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        message: "User not found.",
      });
    }

    bcrypt.hash(newPassword, 8, async (err, hash) => {
      if (err) {
        return res.status(400).json({
          message: "An error occurred. Please try again later",
        });
      }

      await userModel.findOneAndUpdate(
        { email: email },
        { password: hash },
        { new: true }
      );

      // Clean up verification code
      delete global.verificationCodes[email];

      return res.status(200).json({
        message:
          "Password reset successful! You can now login with your new password.",
      });
    });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Resend forgot password verification code
userRouter.post("/resend-forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    if (!global.verificationCodes || !global.verificationCodes[email]) {
      return res.status(400).json({
        message:
          "No pending password reset found. Please start the process again.",
      });
    }

    const emailVerification = await verifyEmailExists(email);
    if (!emailVerification.success) {
      return res.status(400).json({
        message: "Unable to send verification code. Please try again later.",
      });
    }

    global.verificationCodes[email].code = emailVerification.code;
    global.verificationCodes[email].expires = Date.now() + 10 * 60 * 1000;
    global.verificationCodes[email].verified = false; // Reset verification status

    return res.status(200).json({
      message: "New verification code sent to your email.",
    });
  } catch (err) {
    console.error("Resend forgot password verification error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const check = await userModel.findOne({ email: email });
    if (!check) {
      return res
        .status(400)
        .json({ message: "User does not exist. Please signup" });
    }
    if (!check.activity) {
      return res
        .status(403)
        .json({ message: "You have been disabled by admin." });
    }
    bcrypt.compare(password, check.password, async (err, result) => {
      if (err) {
        return res.status(400).json({
          message:
            "An error occurred while verifying password. Try again later",
        });
      }
      if (result) {
        const payload = { email: check.email, id: check._id, userName: check.userName };
        jwt.sign(payload, key, (err, token) => {
          if (err) {
            return res.status(400).json({
              message: "An error has occurred . Please try again later",
            });
          }
          return res.status(200).json({
            token: token,
            user: check._id,
            role: check.role,
            email: check.email,
            phone: check.phone,
            userName: check.userName,
          });
        });
      } else {
        return res
          .status(400)
          .json({ message: "Email address and password do not match" });
      }
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});
userRouter.get("/logout", auth, async (req, res) => {
  try {
    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});
userRouter.get("/all", async (req, res) => {
  try {
    const user = await userModel.find({});
    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});
userRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // await menuModel.deleteMany({user:id})
    await userModel.findByIdAndDelete(id);
    return res.status(200).json({ message: "User deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});
userRouter.get("/admin-route", async (req, res) => {
  try {
    const user = await userModel.find({ role: { $ne: roles.admin } });
    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});
userRouter.patch("/update-role/:id", async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await userModel.findByIdAndUpdate(id, { role: role }, { new: true });
    return res.status(200).json({ message: `User role has been updated` });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});
userRouter.patch("/toggle-activity/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.activity = !user.activity;
    await user.save();
    return res.status(200).json({
      message: `User has been ${user.activity ? "Enabled" : "Disabled"}`,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = userRouter;
