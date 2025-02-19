const { SuccessResponse } = require("../responseHandle/success.response");
const ShippingInfoService = require("../services/shippinginfo.service");

class ShippingInfoController {
  create = async (req, res, next) => {
    const shippingInfo = await ShippingInfoService.createShip(
      req.params.id,
      req.body
    );
    new SuccessResponse({
      message: "Tạo thông tin vận chuyển thành công",
      data: shippingInfo,
    }).send(res);
  };
  updateShippingStatus = async (req, res, next) => {
    const shippingInfo = await ShippingInfoService.updateShippingStatus(
      req.body,
      req.params.id
    );
    new SuccessResponse({
      message: "Cập nhật thông tin vận chuyển thành công",
      data: shippingInfo,
    }).send(res);
  };

  getAllShippingInfo = async (req, res, next) => {
    const shippingInfo = await ShippingInfoService.getAllShippingInfo();
    new SuccessResponse({
      message: "Lấy tất cả thông tin vận chuyển thành công",
      data: shippingInfo,
    }).send(res);
  };

  getShippingInfo = async (req, res, next) => {
    const shippingInfo = await ShippingInfoService.getShippingInfo(
      req.params.id
    );
    new SuccessResponse({
      message: "Lấy thông tin vận chuyển thành công",
      data: shippingInfo,
    }).send(res);
  };

  getShippingInfoByStatus = async (req, res, next) => {
    const shippingInfo = await ShippingInfoService.getShippingInfoByStatus(
      req.query.status
    );
    new SuccessResponse({
      message: "Lấy thông tin vận chuyển theo trạng thái thành công",
      data: shippingInfo,
    }).send(res);
  };

  getAllDeliveredOrders = async (req, res, next) => {
    const shippingInfo = await ShippingInfoService.getAllDeliveredOrders(req);
    new SuccessResponse({
      message: "Lấy tất cả đơn hàng đang giao thành công",
      data: shippingInfo,
    }).send(res);
  }
}

module.exports = new ShippingInfoController();
