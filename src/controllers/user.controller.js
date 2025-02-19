const { SuccessResponse } = require("../responseHandle/success.response");
const UserService = require("../services/user.service");
const { userSchema } = require("../models/user.model");
const sendMail = require("../utils/sendMail");

class UserController {
  signUp = async (req, res, next) => {
    const user = await UserService.signUp(req.body);
    new SuccessResponse({
      message: "Đăng ký thành công",
      data: user,
    }).send(res);
  };

  signIn = async (req, res, next) => {
    const { user, token } = await UserService.signIn(req.body, res);
    new SuccessResponse({
      message: "Đăng nhập thành công",
      data: { user, token },
    }).send(res);
  };

  userDetail = async (req, res, next) => {
    const user = await UserService.userDetail(req.user);
    new SuccessResponse({
      message: "Lấy thông tin user thành công",
      data: user,
    }).send(res);
  };

  logOut = async (req, res, next) => {
    await UserService.logOut(res);
    new SuccessResponse({
      message: "Đăng xuất thành công",
    }).send(res);
  };

  allUsers = async (req, res, next) => {
    const users = await userSchema.find();
    new SuccessResponse({
      message: "Lấy thông tin tất cả user thành công",
      data: users,
    }).send(res);
  };

  updateUser = async (req, res, next) => {
    const updatedUser = await UserService.updateUser(req.body);
    new SuccessResponse({
      message: "Cập nhật thông tin user thành công",
      data: updatedUser,
    }).send(res);
  };

  requestPasswordReset = async (req, res, next) => {
    const requestPasswordReset = await UserService.requestPasswordReset(req.body);
    new SuccessResponse({
      message: "Yêu cầu đặt lại mật khẩu thành công",
      data: requestPasswordReset,
    }).send(res);
  };
   
  resetPassword = async (req, res, next) => {
    const resetPassword = await UserService.resetPassword(req);
    new SuccessResponse({
      message: "Đặt lại mật khẩu thành công",
      data: resetPassword,
    }).send(res);
  }

  changePassword = async (req, res, next) => {
    const changePassword = await UserService.changePassword(req.body, req.user);
    new SuccessResponse({
      message: "Đổi mật khẩu thành công",
      data: changePassword,
    }).send(res);
  }

  userDetail = async (req, res, next) => {
    const user = await UserService.userDetail(req.user);
    new SuccessResponse({
      message: "Lấy thông tin user thành công",
      data: user,
    }).send(res);
  }
}

  

module.exports = new UserController();
