const { productSchema } = require("../models/product.model");
const { SuccessResponse } = require("../responseHandle/success.response");
const ProductService = require("../services/product.service");

class ProductController {
  uploadProducts = async (req, res, next) => {
    const product = await ProductService.uploadProducts(req.body);
    new SuccessResponse({
      message: "Thêm sản phẩm thành công",
      data: product,
    }).send(res);
  };

  getAllProducts = async (req, res, next) => {
    const products = await ProductService.getAllProducts();
    new SuccessResponse({
      message: "Lấy tất cả sản phẩm thành công",
      data: products,
    }).send(res);
  };

  updateProduct = async (req, res, next) => {
    const updatedProduct = await ProductService.updateProduct(req.body, req.params.id);
    new SuccessResponse({
      message: "Cập nhật sản phẩm thành công",
      data: updatedProduct,
    }).send(res);
  };

  getCategoryProductOne = async (req, res, next) => {
    const products = await ProductService.getCategoryProductOne();
    new SuccessResponse({
      message: "Lấy sản phẩm theo danh mục thành công",
      data: products,
    }).send(res);
  };

  getCategoryWiseProduct = async (req, res) => {
    const products = await ProductService.getCategoryWiseProduct(req?.body);
    new SuccessResponse({
      message: "Lấy sản phẩm theo danh mục thành công",
      data: products,
    }).send(res);
  };

  getProductDetails = async (req, res) => {
    const product = await ProductService.getProductDetails(req.body);
    new SuccessResponse({
      message: "Lấy chi tiết sản phẩm thành công",
      data: product,
    }).send(res);
  };

  searchProduct = async (req, res) => {
    const products = await ProductService.searchProduct(req.query.q);
    new SuccessResponse({
      message: "Tìm kiếm sản phẩm thành công",
      data: products,
    }).send(res);
  };

  filterProduct = async (req, res) => {
    const products = await ProductService.filterProduct(req.body.category);
    new SuccessResponse({
      message: "Lọc sản phẩm thành công",
      data: products,
    }).send(res);
  };
  deleteProduct = async (req, res) => {
    const product = await ProductService.deleteProduct(req.body);
    new SuccessResponse({
      message: "Xóa sản phẩm thành công",
      data: product,
    }).send(res);
  };

  productNotActive = async (req, res) => {
    const products = await ProductService.productNotActive();
    new SuccessResponse({
      message: "Lấy sản phẩm không active thành công",
      data: products,
    }).send(res);
  };

  updateProductActive = async (req, res) => {
    const product = await ProductService.updateProductActive(req.body, req.params.id);
    new SuccessResponse({
      message: "Thay đổi trạng thái sản phẩm thành công",
      data: product,
    }).send(res);
  }

  getCategory = async (req, res, next) => {
    const products = await ProductService.getCategory(req);
    new SuccessResponse({
      message: "Lấy danh mục sản phẩm thành công",
      data: products,
    }).send(res);
  }

  createComment = async (req, res) => {
    const product = await ProductService.createComment(req, req.body, req.params.id);
    new SuccessResponse({
      message: "Tạo đánh giá thành công",
      data: product,
    }).send(res);
  }

  getCommentById = async (req, res) => {
    const product = await ProductService.getCommentById(req.params.id);
    new SuccessResponse({
      message: "Lấy đánh giá thành công",
      data: product,
    }).send(res);
  }
}

module.exports = new ProductController();
