
const { Schema, model } = require("mongoose");
const { roles } = require("../utils/constant");
const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    userName: { type: String, required: true },
    role: {
      type: String,
      enum: [roles.admin, roles.user],
      default: roles.user,
    },
    activity: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
const userModel = model("customers", userSchema);
module.exports = userModel;
