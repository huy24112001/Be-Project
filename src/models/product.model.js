const { model, Schema } = require("mongoose");

// Định nghĩa sub-schema cho bình luận
const commentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    rate: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now, // Tự động lưu thời gian tạo bình luận
    },
  },
  { _id: false } // Không cần tạo ObjectId riêng cho sub-document
);

const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    brandName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    productImage: {
      type: [String], // Danh sách URL ảnh
      default: [],
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    sellingPrice: {
      type: Number,
      default: 0,
    },
    priceInventory: {
      type: Number,
      default: 0,
    },
    quantityInStock: {
      type: Number,
      default: 0,
    },
    quantitySold: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: false,
    },
    // Danh sách bình luận và đánh giá của sản phẩm
    listComment: [commentSchema],
    totalRate: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true } // Tự động lưu createdAt và updatedAt cho sản phẩm
);

module.exports = { productSchema: model("product", productSchema) };
