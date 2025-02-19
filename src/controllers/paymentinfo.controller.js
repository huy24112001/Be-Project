const { paymentInfoSchema } = require("../models/paymentinfo.model");
const { SuccessResponse } = require("../responseHandle/success.response");
const PaymentInfoService = require("../services/paymentinfo.service");

class PaymentInfoController {
  getById = async (req, res) => {
    const paymentInfo = await PaymentInfoService.getById(req.params.id);
    new SuccessResponse({
      message: "Lấy thông tin thanh toán thành công",
      data: paymentInfo,
    }).send(res);
  };

  getAllByUser = async (req, res) => {
    const paymentInfos = await PaymentInfoService.getAllByUser(req);
    new SuccessResponse({
      message: "Lấy danh sách thông tin thanh toán thành công",
      data: paymentInfos,
    }).send(res);
  };

  getAllNotConfirmOrderByUser = async (req, res) => {
    const paymentInfos = await PaymentInfoService.getAllNotConfirmOrderByUser(
      req
    );
    new SuccessResponse({
      message: "Lấy danh sách thông tin thanh toán thành công",
      data: paymentInfos,
    }).send(res);
  };

  getAllConfirmOrderByUser = async (req, res) => {
    const paymentInfos = await PaymentInfoService.getAllConfirmOrderByUser(req);
    new SuccessResponse({
      message: "Lấy danh sách thông tin thanh toán thành công",
      data: paymentInfos,
    }).send(res);
  };

  getAllCanceledOrderByUser = async (req, res) => {
    const paymentInfos = await PaymentInfoService.getAllCanceledOrderByUser(
      req
    );
    new SuccessResponse({
      message: "Lấy danh sách thông tin thanh toán thành công",
      data: paymentInfos,
    }).send(res);
  };

  updateByUser = async (req, res) => {
    const paymentInfo = await PaymentInfoService.updateByUser(
      req.body,
      req.params.id,
      req
    );
    new SuccessResponse({
      message: "Cập nhật thông tin thanh toán thành công",
      data: paymentInfo,
    }).send(res);
  };

  cancelOrderByUser = async (req, res) => {
    const paymentInfo = await PaymentInfoService.cancelOrderByUser(
      req,
      req.params.id
    );
    new SuccessResponse({
      message: "Hủy đơn hàng thành công",
      data: paymentInfo,
    }).send(res);
  };

  confirmOrderByUser = async (req, res) => {
    const paymentInfo = await PaymentInfoService.confirmOrderByUser(
      req,
      req.params.id
    );
    new SuccessResponse({
      message: "Xác nhận đơn hàng thành công",
      data: paymentInfo,
    }).send(res);
  };

  create = async (req, res) => {
    const paymentInfo = await PaymentInfoService.create(req.body, req);
    new SuccessResponse({
      message: "Tạo thông tin thanh toán thành công",
      data: paymentInfo,
    }).send(res);
  };

  createVietQR = async (req, res) => {
    const qr = await PaymentInfoService.createVietQR(req);
    new SuccessResponse({
      message: "Tạo mã QR thành công",
      data: qr,
    }).send(res);
  };

  checkTransactionStatus = async (req, res) => {
    const transaction = await PaymentInfoService.checkTransactionStatus(
      req.body, req.params.transactionId,
    );
    new SuccessResponse({
      message: "Kiểm tra trạng thái giao dịch thành công",
      data: transaction,
    }).send(res);
  };

  deleteCanceledOrder = async (req, res) => {
    await PaymentInfoService.deleteCanceledOrder(req, req.params.id);
    new SuccessResponse({
      message: "Xóa đơn hàng đã hủy thành công",
    }).send(res);
  };

  // đối với sale
  getAllConfirmedOrderSale = async (req, res) => {
    const paymentInfos = await PaymentInfoService.getAllConfirmedOrderSale();
    new SuccessResponse({
      message: "Lấy tất cả đơn hàng đã xác nhận thành công",
      data: paymentInfos,
    }).send(res);
  };
  getAllCanceledOrderSale = async (req, res) => {
    const paymentInfos = await PaymentInfoService.getAllCanceledOrderSale();
    new SuccessResponse({
      message: "Lấy tất cả các đơn hàng đã hủy thành công",
      data: paymentInfos,
    }).send(res);
  };

  getAllNotConfirmOrderSale = async (req, res) => {
    const paymentInfos = await PaymentInfoService.getAllNotConfirmOrderSale();
    new SuccessResponse({
      message: "Lấy danh sách đơn hàng chưa xác nhận thành công",
      data: paymentInfos,
    }).send(res);
  };

  getAllShippingOrder = async (req, res) => {
    const paymentInfos = await PaymentInfoService.getAllShippingOrder(req);
    new SuccessResponse({
      message: "Lấy danh sách đơn hàng đang giao hàng thành công",
      data: paymentInfos,
    }).send(res);
  };

  getAllDeliveredOrdersForReview = async (req, res) => {
    const paymentInfos = await PaymentInfoService.getAllDeliveredOrdersForReview(req);
    new SuccessResponse({
      message: "Lấy danh sách đơn hàng đã giao thành công",
      data: paymentInfos,
    }).send(res);
  }

  choosePaymentMethod = async (req, res) => {
    await PaymentInfoService.choosePaymentMethod(req, req.params.id);
    new SuccessResponse({
      message: "Chọn phương thức thanh toán khi nhận hàng thành công",
    }).send(res);
  }

  getAllDeliveredOrders = async (req, res) => {
    const paymentInfos = await PaymentInfoService.getAllDeliveredOrders(req);
    new SuccessResponse({
      message: "Lấy danh sách đơn hàng đã giao thành công",
      data: paymentInfos,
    }).send(res);
  }

  
}
module.exports = new PaymentInfoController();
