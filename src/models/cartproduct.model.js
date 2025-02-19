const { model, Schema } = require("mongoose");

const cartProductSchema = new Schema(
  {
    userId: String,
    productId: {
      type: Schema.Types.ObjectId,
      ref: "product",
    },
    quantity: Number,
  },
  { timestamps: true }
);

module.exports = { cartProductSchema: model("cartProduct", cartProductSchema) };
