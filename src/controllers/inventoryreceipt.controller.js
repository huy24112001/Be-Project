const { SuccessResponse } = require("../responseHandle/success.response");
const InventoryReceiptService = require("../services/inventoryreceipt.service");

class InventoryReceiptController {
  createInventory = async (req, res, next) => {
    const inventoryReceipt = await InventoryReceiptService.createInventory(
      req.body,
      req
    );
    new SuccessResponse({
      message: "Tạo phiếu nhập kho thành công",
      data: inventoryReceipt,
    }).send(res);
  };

  update = async (req, res, next) => {
    const inventoryReceipt = await InventoryReceiptService.update(
      req.body,
      req.params.id
    );
    new SuccessResponse({
      message: "Cập nhật phiếu nhập kho thành công",
      data: inventoryReceipt,
    }).send(res);
  };

  delete = async (req, res, next) => {
    await InventoryReceiptService.delete(req.params.id);
    new SuccessResponse({
      message: "Xóa phiếu nhập kho thành công",
    }).send(res);
  };

  getAllInventoryReceipt = async (req, res, next) => {
    const inventoryReceipt = await InventoryReceiptService.getAll();
    new SuccessResponse({
      message: "Lấy tất cả phiếu nhập kho thành công",
      data: inventoryReceipt,
    }).send(res);
  };
}

module.exports = new InventoryReceiptController();
