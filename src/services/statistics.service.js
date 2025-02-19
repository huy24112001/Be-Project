const { BadRequestError } = require("../responseHandle/error.response");
const { productSchema } = require("../models/product.model");
const { inventoryReceiptSchema } = require("../models/inventoryreceipt.model");
const { paymentInfoSchema } = require("../models/paymentinfo.model");
const { shippingInfoSchema } = require("../models/shippinginfo.model");
const moment = require("moment");

const validateMonthYear = ({ month, year }) => {
  if (!month || !year) {
      throw new Error("Vui lòng cung cấp đầy đủ month và year");
  }

  const parsedMonth = parseInt(month, 10);
  const parsedYear = parseInt(year, 10);

  if (
      isNaN(parsedMonth) || 
      isNaN(parsedYear) || 
      parsedMonth < 1 || 
      parsedMonth > 12
  ) {
      throw new Error("month phải từ 1 đến 12 và year phải là số hợp lệ");
  }

  return { parsedMonth, parsedYear }; // Trả về giá trị đã được kiểm tra
};

class StatisticsService {
  // Tính doanh thu, thu nhập, lợi nhuận, số lượng sản phẩm bán ra trong tháng
  static getMonthlyStatistics = async ({ month, year }) => {
    const { parsedMonth, parsedYear } = validateMonthYear({ month, year });

    const startDate = moment()
      .year(parsedMonth)
      .month(parsedYear - 1)
      .startOf("month")
      .toDate();
    const endDate = moment()
      .year(parsedMonth)
      .month(parsedYear - 1)
      .endOf("month")
      .toDate();

    // Lấy danh sách các đơn hàng đã giao trong tháng
    const shippingInfos = await shippingInfoSchema
      .find({
        shippingStatus: "Đã giao",
        createdAt: { $gte: startDate, $lte: endDate },
      })
      .populate({
        path: "paymentInfo",
        populate: {
          path: "productList.productId",
        },
      });

    // Lấy danh sách các phiếu nhập kho trong tháng
    const inventoryReceipts = await inventoryReceiptSchema
      .find({
        createdAt: { $gte: startDate, $lte: endDate },
      })
      .populate("productList.productId");

    let totalRevenue = 0; // Tổng doanh thu
    let totalQuantity = 0; // Tổng số lượng sản phẩm bán ra
    let totalShippingFee = 0; // Tổng phí vận chuyển
    let totalAmountInventory = 0; // Tổng tiền nhập kho

    // Tính tổng tiền nhập kho
    for (const inventoryReceipt of inventoryReceipts) {
      totalAmountInventory += inventoryReceipt.totalAmount || 0;
    }

    // Tính toán từ danh sách đơn hàng
    for (const shippingInfo of shippingInfos) {
      totalRevenue += shippingInfo.paymentInfo?.totalAmount || 0;
      totalShippingFee += shippingInfo.shippingFee || 0;

      // Tính tổng số lượng sản phẩm bán ra
      if (shippingInfo.paymentInfo?.productList) {
        for (const product of shippingInfo.paymentInfo.productList) {
          totalQuantity += product.quantity || 0;
        }
      }
    }

    // Tính tổng lợi nhuận
    const totalProfit = totalRevenue - totalShippingFee;

    return {
      totalRevenue,
      totalQuantity,
      totalProfit,
      totalAmountInventory,
      totalShippingFee,
    };
  };

  static getRangeStatistics = async ({ startDate, endDate }) => {
    

    const start = moment(startDate).startOf("day").toDate();
    const end = moment(endDate).endOf("day").toDate();

    // Lấy danh sách các đơn hàng đã giao trong khoảng thời gian
    const shippingInfos = await shippingInfoSchema
      .find({
        shippingStatus: "Đã giao",
        createdAt: { $gte: start, $lte: end },
      })
      .populate({
        path: "paymentInfo",
        populate: {
          path: "productList.productId",
        },
      });

    // Lấy danh sách các phiếu nhập kho trong khoảng thời gian
    const inventoryReceipts = await inventoryReceiptSchema
      .find({
        createdAt: { $gte: start, $lte: end },
      })
      .populate("productList.productId");

    let totalRevenue = 0; // Tổng doanh thu
    let totalQuantity = 0; // Tổng số lượng sản phẩm bán ra
    let totalShippingFee = 0; // Tổng phí vận chuyển
    let totalAmountInventory = 0; // Tổng tiền nhập kho

    // Tính tổng tiền nhập kho
    totalAmountInventory = inventoryReceipts.reduce(
      (sum, receipt) => sum + (receipt.totalAmount || 0),
      0
    );

    // Tính toán từ danh sách đơn hàng đã giao
    for (const shippingInfo of shippingInfos) {
      totalRevenue += shippingInfo.paymentInfo?.totalAmount || 0;
      totalShippingFee += shippingInfo.shippingFee || 0;

      // Tính tổng số lượng sản phẩm bán ra
      if (shippingInfo.paymentInfo?.productList) {
        totalQuantity += shippingInfo.paymentInfo.productList.reduce(
          (sum, product) => sum + (product.quantity || 0),
          0
        );
      }
    }

    // Tính tổng lợi nhuận
    const totalProfit = totalRevenue - totalShippingFee;

    return {
      totalRevenue,
      totalQuantity,
      totalProfit,
      totalAmountInventory,
      totalShippingFee,
    };
  };
}

module.exports = StatisticsService;
