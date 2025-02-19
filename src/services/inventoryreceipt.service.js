const { BadRequestError } = require("../responseHandle/error.response");
const { inventoryReceiptSchema } = require("../models/inventoryreceipt.model");
const { productSchema } = require("../models/product.model");

class InventoryReceiptService {
  static createInventory = async (data, req) => {
    const sessionUser = req.user;
    const {
      productList,
      supplierName,
      address,
      date,
      deliveryPerson,
      phoneNumber,
    } = data;

    const phoneRegex = /^(\+84|0)[1-9]\d{8,9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      throw new BadRequestError(
         `Số điện thoại không hợp lệ!`
      );
    }

    // Kiểm tra tồn tại của tất cả sản phẩm trong productList và tính tổng
    const productIds = productList.map((item) => item.productId);
    const products = await productSchema.find({ _id: { $in: productIds } });

    if (products.length !== productList.length) {
      throw new BadRequestError("Một hoặc nhiều sản phẩm không tồn tại");
    }

    let total = 0;
    // Tính tổng số tiền
    productList.forEach((item) => {
      total += item.quantity * item.price;
    });
    console.log(total);
    // Tạo phiếu nhập kho
    const inventoryReceipt = await inventoryReceiptSchema.create({
      productList,
      totalAmount: total,
      supplierName,
      address,
      date,
      creator: sessionUser,
      deliveryPerson,
      phoneNumber,
    });
    console.log(inventoryReceipt);

    // Cập nhật số lượng sản phẩm trong kho song song
    const updatePromises = productList.map(async (item) => {
      const product = products.find((p) => p._id.toString() === item.productId);
      product.quantity += item.quantity;
      product.priceInventory = item.price;
      product.quantityInStock += item.quantity;
      await product.save();
    });

    // Chạy tất cả các promise cập nhật kho song song
    await Promise.all(updatePromises);

    return inventoryReceipt;
  };

  static update = async (data, id) => {
    const {
      productList,
      supplierName,
      address,
      date,
      deliveryPerson,
      phoneNumber,
    } = data;
    let total = 0;
    for (let i = 0; i < productList.length; i++) {
      const checkProduct = await productSchema.findById(
        productList[i].productId
      );
      if (!checkProduct) {
        throw new BadRequestError("Sản phẩm không tồn tại");
      }
    }
    for (let i = 0; i < productList.length; i++) {
      total += productList[i].quantity * productList[i].price;
    }
    const inventoryReceipt = await inventoryReceiptSchema.findByIdAndUpdate(
      id,
      {
        productList,
        totalAmount: total,
        supplierName,
        address,
        date,
        deliveryPerson,
        phoneNumber,
      }
    );
    return inventoryReceipt;
  };

  static delete = async (id) => {
    const inventoryReceipt = await inventoryReceiptSchema.findByIdAndDelete(id);
    return inventoryReceipt;
  };

  static getAll = async () => {
    const inventoryReceipts = await inventoryReceiptSchema
      .find()
      .populate({
        path: "productList",
        populate: {
          path: "productId",
          select: "productName brandName category -_id",
        },
      }).sort({ createdAt: -1 })
      .lean();

    const result = inventoryReceipts.map((receipt) => ({
      ...receipt,
      productList: receipt.productList.map(({ _id, ...product }) => product),
    }));
    return result;
  };
}

module.exports = InventoryReceiptService;
