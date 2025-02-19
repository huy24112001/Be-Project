const { model, Schema } = require("mongoose");

const paymentInfoSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Đã thanh toán", "Chưa chọn phương thức thanh toán", "Thanh toán khi nhận hàng"],
      default: "Chưa chọn phương thức thanh toán",
    },
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
      },
    ],
    orderStatus: {
      type: String,
      enum: ["Đang xử lý", "Đang giao hàng", "Đã giao hàng", "Đã hủy", "Đang chờ đơn vị vận chuyển"],
      default: "Đang xử lý",
    },
    totalAmount: {
      type: Number,
      min: 0,
    },
    // xác nhận đơn hàng
    confirmOrder: {
      type: Boolean,
      default: false,
    },
    
  },
  { timestamps: true }
);

module.exports ={ paymentInfoSchema: model("paymentInfo", paymentInfoSchema) };
