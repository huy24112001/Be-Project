const { BadRequestError } = require("../responseHandle/error.response");
const { shippingInfoSchema } = require("../models/shippinginfo.model");
const { paymentInfoSchema } = require("../models/paymentinfo.model");
const { productSchema } = require("../models/product.model");

class ShippingInfoService {
  static createShip = async (id, data) => {
    const { maVanDon, shippingMethod, deliveryDate, shippingFee } = data;
    console.log("data:::", data);
    console.log(maVanDon, shippingMethod, deliveryDate, shippingFee);

    // Kiểm tra xem thông tin thanh toán có tồn tại không
    const checkPaymentInfo = await paymentInfoSchema.findById(id);
    if (!checkPaymentInfo) {
      throw new BadRequestError("Thông tin thanh toán không tồn tại");
    }
    console.log("checkPaymentInfo:::", checkPaymentInfo);

    // Lấy danh sách sản phẩm từ thông tin thanh toán
    const productList = checkPaymentInfo.productList;

    // Truy vấn tất cả sản phẩm trong một lần
    const productIds = productList.map((item) => item.productId);
    const products = await productSchema.find({ _id: { $in: productIds } });

    // Tạo một Map để ánh xạ sản phẩm theo _id để truy cập nhanh hơn
    const productMap = new Map(
      products.map((product) => [product._id.toString(), product])
    );

    // Cập nhật số lượng tồn kho và kiểm tra số lượng
    for (let i = 0; i < productList.length; i++) {
      const { productId, quantity } = productList[i];
      const product = productMap.get(productId.toString());

      if (!product) {
        throw new BadRequestError("Sản phẩm không tồn tại");
      }

      // Kiểm tra số lượng tồn kho
      if (product.quantityInStock < quantity) {
        throw new BadRequestError("Số lượng sản phẩm trong kho không đủ");
      }

      // Trừ số lượng tồn kho
      product.quantityInStock -= quantity;
    }

    // Lưu tất cả sản phẩm đã được cập nhật tồn kho
    await Promise.all(
      Array.from(productMap.values()).map((product) => product.save())
    );

    // Cập nhật trạng thái đơn hàng và xác nhận đơn hàng
    checkPaymentInfo.orderStatus = "Đang chờ đơn vị vận chuyển";
    checkPaymentInfo.confirmOrder = true;
    await checkPaymentInfo.save();

    // Tính tổng số tiền
    let totalAmount = 0;
    totalAmount += checkPaymentInfo.totalAmount + shippingFee;

    // Tạo thông tin vận chuyển
    const shippingInfo = await shippingInfoSchema.create({
      paymentInfo: id,
      maVanDon,
      shippingMethod,
      deliveryDate,
      shippingFee,
      totalAmount: totalAmount,
    });

    return shippingInfo;
  };

  static updateShippingStatus = async (data, id) => {
    const { shippingStatus, deliveryDate } = data;

    // Find shipping information by ID
    const checkShippingInfo = await shippingInfoSchema.findById(id);
    if (!checkShippingInfo) {
      throw new BadRequestError("Thông tin vận chuyển không tồn tại");
    }

    const checkPaymentInfo = await paymentInfoSchema.findById(
      checkShippingInfo.paymentInfo
    );
    if (!checkPaymentInfo) {
      throw new BadRequestError("Thông tin thanh toán không tồn tại");
    }

    const statusMap = {
      "Đã giao": "Đã giao hàng",
      "Đã hủy": "Đã hủy",
      "Đang chờ đơn vị vận chuyển": "Đang chờ đơn vị vận chuyển",
      "Đã lấy hàng": "Đang giao hàng",
      "Đang giao": "Đang giao hàng",
    };

    const newOrderStatus = statusMap[shippingStatus];
    if (checkPaymentInfo.orderStatus !== newOrderStatus) {
      checkPaymentInfo.orderStatus = newOrderStatus;
      await checkPaymentInfo.save();
    }

    const updatedShippingInfo = await shippingInfoSchema.findByIdAndUpdate(
      id,
      {
        shippingStatus,
        deliveryDate,
      },
      { new: true }
    );

    // nếu trạng thái là đã giao hàng thì tăng số lượng quantityInSold
    if (shippingStatus === "Đã giao") {
      const productList = checkPaymentInfo.productList;
      for (let i = 0; i < productList.length; i++) {
        const product = await productSchema.findById(productList[i].productId);
        if (!product) {
          throw new BadRequestError("Sản phẩm không tồn tại");
        }
        product.quantitySold += productList[i].quantity;
        await product.save();
      }
    }
    return updatedShippingInfo;
  };

  static getShippingInfo = async (id) => {
    const shippingInfo = await shippingInfoSchema.findById(id);
    if (!shippingInfo) {
      throw new BadRequestError("Thông tin vận chuyển không tồn tại");
    }
    return shippingInfo;
  };

  // lấy tất cả các đơn hàng mà confirmOrder = true
  static getAllShippingInfo = async () => {
    const shippingInfo = await shippingInfoSchema
      .find({ shippingStatus: { $ne: "Đã hủy" } })
      .sort({ createdAt: -1 })
      // Lọc các đơn hàng không có trạng thái "Đã giao"
      .populate({
        path: "paymentInfo",
        populate: {
          path: "productList.productId", // Populate thông tin sản phẩm chi tiết
        },
      })
      .exec();
    return shippingInfo;
  };

  static getShippingInfoByStatus = async (status) => {
    const shippingInfo = await shippingInfoSchema.find({
      shippingStatus: status,
    });
    return shippingInfo;
  };

  // lấy ra những đơn hàng đang giao hàng của user và đang chờ đơn vị vận chuyển trừ đơn Đã hủy và Đã giao
  static getAllDeliveredOrders = async (req) => {
    const sessionUser = req.user;

    const shippingInfo = await shippingInfoSchema
      .find({
        shippingStatus: {
          $in: ["Đang giao", "Đang chờ đơn vị vận chuyển", "Đã lấy hàng"],
        },
      })
      .populate({
        path: "paymentInfo",
        match: { userId: sessionUser },
        select:
          "productList totalAmount orderStatus address phone paymentStatus",
        populate: {
          path: "productList.productId",
        },
      })
      .exec();

    // Loại bỏ các đơn hàng không có `paymentInfo`
    const filteredShippingInfo = shippingInfo.filter(
      (item) => item.paymentInfo
    );
    return filteredShippingInfo; // Trả về danh sách đơn hàng đã xử lý
  };
}
module.exports = ShippingInfoService;
