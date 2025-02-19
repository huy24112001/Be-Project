const { model, Schema, Types } = require("mongoose");
const crypto = require("crypto");

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: String,
    profilePic: String,
    // tạo role bao gồm nhân viên kho, nhân viên bán hàng, chủ cửa hàng, admin, khách hàng
    role: {
      type: String,
      enum: ["ADMIN", "GENERAL", "INVENTORY", "SALE", "OWNER"],
      default: "GENERAL",
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

userSchema.methods = {
  createPasswordChangedToken: function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    return resetToken;
  },
};

module.exports = {
  userSchema: model("user", userSchema),
};
