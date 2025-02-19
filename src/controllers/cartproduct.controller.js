const { SuccessResponse } = require("../responseHandle/success.response");
const CartProductService = require("../services/cartproduct.service");

class CartProductController {
  addProductToCart = async (req, res, next) => {
    const product = await CartProductService.addProductToCart(req.body, req);
    new SuccessResponse({
      message: "Thêm sản phẩm vào giỏ hàng thành công",
      data: product,
    }).send(res);
  };

  countProductInCart = async (req, res, next) => {
    const count = await CartProductService.countProductInCart(req);
    new SuccessResponse({
      message: "Đếm số lượng sản phẩm trong giỏ hàng thành công",
      data: count,
    }).send(res);
  };

  addProductToCartView = async (req, res, next) => {
    const products = await CartProductService.addProductToCartView(req);
    new SuccessResponse({
      message: "Tăng số lượng sản phẩm trong giỏ hàng thành công",
      data: products,
    }).send(res);
  };

  updateProductInCart = async (req, res, next) => {
    const product = await CartProductService.updateProductInCart(req);
    new SuccessResponse({
      message: "Cập nhật sản phẩm trong giỏ hàng thành công",
      data: product,
    }).send(res);
  };

  deleteProductInCart = async (req, res, next) => {
    const product = await CartProductService.deleteProductInCart(req);
    new SuccessResponse({
      message: "Xóa sản phẩm trong giỏ hàng thành công",
      data: product,
    }).send(res);
  };

  deleteAllProductInCart = async (req, res, next) => {
    const product = await CartProductService.deleteAllProductInCart(req);
    new SuccessResponse({
      message: "Xóa tất cả sản phẩm trong giỏ hàng thành công",
      data: product,
    }).send(res);
  };
}

module.exports = new CartProductController();
