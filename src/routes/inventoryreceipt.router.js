const express = require("express");
const router = express.Router();
const InventoryReceiptController = require("../controllers/inventoryreceipt.controller");
const asyncHandle = require("../helpers/asyncHandler");
const { authToken } = require("../middlewares/auth");

router.use(authToken);

router.post("/create", asyncHandle(InventoryReceiptController.createInventory));
router.put("/update/:id", asyncHandle(InventoryReceiptController.update));
router.delete("/delete/:id", asyncHandle(InventoryReceiptController.delete));
router.get("/all", asyncHandle(InventoryReceiptController.getAllInventoryReceipt));

module.exports = router;