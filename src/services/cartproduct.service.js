const { cartProductSchema } = require("../models/cartproduct.model");
const { BadRequestError } = require("../responseHandle/error.response");

class CartProductService {
  static addProductToCart = async (productData, req) => {
    const sessionUser = req.user;
    if (!sessionUser) {
      throw new BadRequestError("Vui lòng đăng nhâp");
    }
    const { productId } = productData;
    const isProductExist = await cartProductSchema.findOne({
      productId,
      userId: sessionUser,
    });
    if (isProductExist) {
      throw new BadRequestError("Sản phẩm đã tồn tại trong giỏ hàng");
    }
    const payload = {
      quantity: 1,
      productId: productId,
      userId: sessionUser,
    };
    const product = new cartProductSchema(payload);
    await product.save();
    return product;
  };

  static countProductInCart = async (req) => {
    try {
      const sessionUser = req.user;
      const count = await cartProductSchema.countDocuments({
        userId: sessionUser,
      });
      return count;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  };

  static addProductToCartView = async (req) => {
    try {
      const sessionUser = req.user;
      const products = await cartProductSchema
        .find({ userId: sessionUser })
        .populate("productId");
      return products;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  };

  static updateProductInCart = async (req) => {
    try {
      const { productId, quantity } = req.body;
      const sessionUser = req.user;
      const product = await cartProductSchema.findOne({
        productId,
        userId: sessionUser,
      });
      if (!product) {
        throw new BadRequestError("Sản phẩm không tồn tại trong giỏ hàng");
      }
      product.quantity = quantity;
      await product.save();
      return product;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  };

  static deleteProductInCart = async (req) => {
    try {
      const { productId } = req.body;
      const sessionUser = req.user;
      const product = await cartProductSchema.findOneAndDelete({
        productId,
        userId: sessionUser,
      });
      if (!product) {
        throw new BadRequestError("Sản phẩm không tồn tại trong giỏ hàng");
      }
      return product;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  };

  static deleteAllProductInCart = async (req) => {
    try {
      const sessionUser = req.user;
      const products = await cartProductSchema.deleteMany({
        userId: sessionUser,
      });
      return products;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  };
}
module.exports = CartProductService;
