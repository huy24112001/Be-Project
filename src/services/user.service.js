const { userSchema } = require("../models/user.model");
const { BadRequestError } = require("../responseHandle/error.response");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const crypto = require("crypto");
const sendMail = require("../utils/sendMail");

class UserService {
  static signUp = async (Data) => {
    const { email, password, name } = Data;
    if (!email) {
      throw new BadRequestError("Vui lòng nhập email");
    }
    if (!password) {
      throw new BadRequestError("Vui lòng nhập mật khẩu");
    }
    if (!name) {
      throw new BadRequestError("Vui lòng nhập tên");
    }
    const user = await userSchema.findOne({ email });
    if (user) {
      throw new BadRequestError("Email đã tồn tại");
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const payload = {
      ...Data,
      password: hashedPassword,
    };

    const userData = new userSchema(payload);
    await userData.save();
    return userData;
  };

  static signIn = async (Data, res) => {
    const { email, password } = Data;
    const user = await userSchema.findOne({ email });
    if (!user) {
      throw new BadRequestError("Tài khoản không tồn tại");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestError("Mật khẩu không đúng");
    }
    const token = await JWT.sign(
      { _id: user._id, email: user.email },
      process.env.TOKEN_SECRET_KEY,
      {
        expiresIn: "15d",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
    });

    return { user, token };
  };

  static logOut = async (res) => {
    await res.clearCookie("token");
    return true;
  };

  static allUsers = async () => {
    const user = await userSchema.find();
    return user;
  };

  static updateUser = async (Data) => {
    const sessionUser = Data._id;
    const { userId, email, name, role } = Data;
    const user = await userSchema.findById(sessionUser);
    const payload = {
      ...(email && { email: email }),
      ...(name && { name: name }),
      ...(role && { role: role }),
    };
    const updatedUser = await userSchema.findByIdAndUpdate(userId, payload, {
      new: true,
    });
    console.log("updatedUser", updatedUser);
    return updatedUser;
  };

  static requestPasswordReset = async (Data) => {
    const { email } = Data;
    const user = await userSchema.findOne({ email });
    if (!user) {
      throw new BadRequestError("Tài khoản không tồn tại");
    }
    const resetToken = user.createPasswordChangedToken();
    await user.save();

    const html = `Please click on the link below to reset your password. This link will expire in 15 minutes. <a href=${process.env.FRONTEND_URL}/reset-password?token=${resetToken}>Click here</a>`;
    const data = {
      email,
      html,
    };
    const rs = await sendMail(data);
    console.log("rs", rs);
    return rs;
  };

  static resetPassword = async (req) => {
    const { newPassword, confirmPassword } = req.body;
    const tokenReset = req.query?.token;
    console.log("tokenReset", tokenReset);
    const hashedToken = crypto
      .createHash("sha256")
      .update(tokenReset)
      .digest("hex");

    console.log("hashedToken", hashedToken);
    const user = await userSchema.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (newPassword !== confirmPassword) {
      throw new BadRequestError("Mật khẩu không khớp");
    }
    if (!user) {
      throw new BadRequestError("Token không hợp lệ hoặc đã hết hạn");
    }
    user.password = await bcrypt.hash(newPassword, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return user;
  };

  // đổi mật khẩu
  static changePassword = async (Data, id) => {
    const { currentPassword, newPassword, confirmPassword } = Data;
    const user = await userSchema.findById(id);
    if (!user) {
      throw new BadRequestError("Tài khoản không tồn tại");
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestError("Mật khẩu hiện tại không đúng");
    }
    if (newPassword !== confirmPassword) {
      throw new BadRequestError("Mật khẩu không khớp");
    }
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    return user;
  };

  // lấy thông tin user
  static userDetail = async (id) => {
    const user = await userSchema.findById(id).select("-password");
    if (!user) {
      throw new BadRequestError("Tài khoản không tồn tại");
    }
    return user;
  };
}

module.exports = UserService;
