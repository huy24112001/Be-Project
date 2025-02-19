const express = require("express");
const router = express.Router();
const { authToken } = require("../middlewares/auth");

const CartProductController = require("../controllers/cartproduct.controller");
const asyncHandle = require("../helpers/asyncHandler");

router.use(authToken);
router.post("/add-product-to-cart", asyncHandle(CartProductController.addProductToCart));   
router.get("/count-product-in-cart",  asyncHandle(CartProductController.countProductInCart));
router.get("/add-product-to-cart-view" , asyncHandle(CartProductController.addProductToCartView));
router.put("/update-quantity-in-cart" , asyncHandle(CartProductController.updateProductInCart));
router.delete("/delete-product-in-cart" , asyncHandle(CartProductController.deleteProductInCart));
router.delete("/delete-all-product-in-cart" , asyncHandle(CartProductController.deleteAllProductInCart));

module.exports = router;