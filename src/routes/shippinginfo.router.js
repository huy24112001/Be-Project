const express = require("express");
const router = express.Router();
const ShippingInfoController = require("../controllers/shippinginfo.controller");
const asyncHandle = require("../helpers/asyncHandler");
const { authToken } = require("../middlewares/auth");

router.post("/create/:id", asyncHandle(ShippingInfoController.create));
router.put("/updateShippingStatus/:id", asyncHandle(ShippingInfoController.updateShippingStatus));
router.get("/all", asyncHandle(ShippingInfoController.getAllShippingInfo));
router.get("/by/:id", asyncHandle(ShippingInfoController.getShippingInfo));
router.get("/byStatus", asyncHandle(ShippingInfoController.getShippingInfoByStatus));
router.use(authToken);
router.get("/all-Delivered-Orders", asyncHandle(ShippingInfoController.getAllDeliveredOrders));

module.exports = router;
