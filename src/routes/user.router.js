const express = require("express");
const UserController = require("../controllers/user.controller");
const asyncHandle = require("../helpers/asyncHandler");
const router = express.Router();
const {authToken} = require("../middlewares/auth");
const { validator } = require("../validators/index.validator");
const { signUp, signIn, requestPasswordReset } = require("../validators/user.validator");

router.post("/sign-up", validator(signUp), asyncHandle(UserController.signUp));
router.post("/sign-in", validator(signIn), asyncHandle(UserController.signIn));
router.get("/user-detail", authToken, asyncHandle(UserController.userDetail));
router.get("/log-out",asyncHandle(UserController.logOut));

router.get("/all-users", authToken, asyncHandle(UserController.allUsers));
router.put("/update-user", authToken, asyncHandle(UserController.updateUser));

router.post("/request-password-reset", validator(requestPasswordReset), asyncHandle(UserController.requestPasswordReset));
router.put("/reset-password", asyncHandle(UserController.resetPassword));

router.put("/changePassword", authToken, asyncHandle(UserController.changePassword));
router.get("/userDetail", authToken, asyncHandle(UserController.userDetail));


module.exports = router;