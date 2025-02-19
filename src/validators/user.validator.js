const { checkSchema } = require("express-validator");

const signUp = checkSchema({
  email: {
    in: ["body"],
    isEmail: {
      errorMessage: "Email không được để trống",
    },
  },
  password: {
    in: ["body"],
    isLength: {
      errorMessage: "Mật khẩu phải có ít nhất 6 ký tự",
      options: { min: 6 },
    },
  },
  name: {
    in: ["body"],
    isLength: {
      errorMessage: "Tên không được để trống",
    },
  },
});

const signIn = checkSchema({
  email: {
    in: ["body"],
    isEmail: {
      errorMessage: "Email không được để trống",
    },
  },
  password: {
    in: ["body"],
    isLength: {
      errorMessage: "Mật không được để trống",
    },
  },
});

const requestPasswordReset = checkSchema({
  email: {
    in: ["body"],
    isEmail: {
      errorMessage: "Email không được để trống",
    },
  },
});

module.exports = { signUp, signIn, requestPasswordReset };