const { productSchema } = require("../models/product.model");
const { BadRequestError } = require("../responseHandle/error.response");
const { cartProductSchema } = require("../models/cartproduct.model");

class ProductService {
  static uploadProducts = async (productData) => {
    const products = await productSchema.insertMany(productData);
    return products;
  };

  static getAllProducts = async () => {
    const products = await productSchema.find().sort({ quantityInStock: 1 });
    return products;
  };

  static updateProduct = async (productData, id) => {
    const {
      productName,
      brandName,
      category,
      productImage,
      description,
      price,
      sellingPrice,
    } = productData;
    const product = await productSchema.findById(id);
    if (!product) {
      throw new BadRequestError("Không tìm thấy sản phẩm");
    }
    product.productName = productName;
    product.brandName = brandName;
    product.category = category;
    product.productImage = productImage;
    product.description = description;
    product.price = price;
    product.sellingPrice = sellingPrice;
    await product.save();
    return product;
  };

  static getCategoryProductOne = async () => {
    const productByCategory = await productSchema.aggregate([
      {
        $group: {
          _id: "$category", // Nhóm theo category
          product: { $first: "$$ROOT" }, // Lấy sản phẩm đầu tiên trong mỗi nhóm
        },
      },
      {
        $replaceRoot: { newRoot: "$product" }, // Thay thế root bằng sản phẩm
      },
    ]);
    // console.log(productByCategory);
    return productByCategory;
  };

  static getCategoryWiseProduct = async (Data) => {
    const { category } = Data;
    const products = await productSchema.find({ category, active: true });
    return products;
  };

  static getProductDetails = async (data) => {
    const { productId } = data;
    const product = await productSchema.findById(productId);
    return product;
  };

  static searchProduct = async (data) => {
    const query = data;
    const regex = new RegExp(query, "i");
    const products = await productSchema.find({
      $or: [{ productName: regex }, { category: regex }],
      active: true,
    });
    return products;
  };
  static filterProduct = async (data) => {
    const categoryList = data;
    const products = await productSchema.find({
      category: { $in: categoryList },
      active: true,
    });
    return products;
  };

  static deleteProduct = async (data) => {
    const { productId } = data;
    const product = await productSchema.findByIdAndDelete(productId);
    const cartProduct = await cartProductSchema.deleteMany({ productId });
    return product, cartProduct;
  };

  static productNotActive = async () => {
    const products = await productSchema.find({
      active: false,
      quantityInStock: { $gt: 0 },
    });
    return products;
  };

  // chỉnh sửa trạng thái sản phẩm từ active sang not active

  static updateProductActive = async (data, id) => {
    const { active } = data;
    const product = await productSchema.findById(id);
    if (!product) {
      throw new BadRequestError("Sản phẩm không tồn tại");
    }
    product.active = active;
    await product.save();
    return product;
  };

  // lấy ra các category mà có sản phẩm active = true
  static getCategory = async () => {
    let categories = await productSchema.distinct("category", {
      active: true,
    });
    // trả về mảng các category và header là các category đã viết hoa chữ cái đầu
    categories = categories.map((category) => {
      return {
        header: category.charAt(0).toUpperCase() + category.slice(1),
        category,
      };
    });
    return categories;
  };

  // tạo comment và dánh giá cho sản phẩm đã mua
  static createComment = async (req, data, id) => {
    const sessionUser = req.user;
    const { comment, rate } = data;
    if (rate < 1 || rate > 5) {
      throw new BadRequestError("Số sao phải nằm trong khoảng từ 1 đến 5");
    }

    const product = await productSchema.findById(id);
    if (!product) {
      throw new BadRequestError("Sản phẩm không tồn tại");
    }
    product.listComment.push({ userId: sessionUser, comment, rate });
    await product.save();
    return product;
  };

  // lấy ra tất cả comment và số sao trung bình của sản phẩm
  static getCommentById = async (id) => {
    const product = await productSchema.findById(id);

    if (!product) {
      throw new BadRequestError("Sản phẩm không tồn tại");
    }

    // Sắp xếp danh sách bình luận theo thời gian giảm dần
    product.listComment.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Tính số sao trung bình
    let totalRate = 0;
    product.listComment.forEach((comment) => {
      totalRate += comment.rate;
    });
    product.totalRate = product.listComment.length
      ? totalRate / product.listComment.length
      : 0;

    product.totalRate = Math.round(product.totalRate * 10) / 10;

    // Populate thông tin user
    await product.populate({
      path: "listComment.userId",
      select: "name email profilePic -_id",
    });

    await product.save();

    return product;
  };
}
module.exports = ProductService;
