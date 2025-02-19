const express = require("express");
const router = express.Router();

router.use("/api/user", require("./user.router"));
router.use("/api/product", require("./product.router"));
router.use("/api/cartproduct", require("./cartproduct.router"));
router.use("/api/paymentinfo", require("./paymentinfo.router"));
router.use("/api/shippinginfo", require("./shippinginfo.router"));
router.use("/api/inventoryreceipt", require("./inventoryreceipt.router"));
router.use("/api/statistics", require("./statistics.router"));
// router.use("/api/message", require("./message.router"));
// router.use("/api/comment", require("./comment.router"));


module.exports = router;