const { model, Schema } = require("mongoose");

const inventoryReceiptSchema = new Schema(
  {
    productList: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
    },
    // tên nhà cung cấp
    supplierName: {
      type: String,
      required: true,
    },
    // người nhập
    creator: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    address: {
      type: String,
      required: true,
    },
    // ngày nhập
    date: {
      type: Date,
      required: true,
    },
    // người giao hàng
    deliveryPerson: {
      type: String,
      required: true,
    },
    // Số điện thoại
    phoneNumber: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);

module.exports = {
  inventoryReceiptSchema: model("inventoryReceipt", inventoryReceiptSchema),
};
