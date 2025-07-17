const Cart = require('../models/cartModel');
const catchAsync = require('../utils/catchAsync');
const Product = require('../models/productModel');
const AppError = require('../utils/appError');
const Coupon = require('../models/couponModel');

// Add item to cart (create new cart if it doesn't exist)
exports.addItemToCart = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.body.product);
  if (!product) return next(new AppError('There is no product with this id', 404));

  // Color validation
  if (product.colors?.length > 0) {
    if (!product.colors.includes(req.body.color)) {
      return next(
        new AppError(
          `Color "${req.body.color}" is not available for this product. Available colors: ${product.colors.join(', ')}`,
          400
        )
      );
    }
  } else if (req.body.color) {
    return next(new AppError('This product does not support colors', 400));
  }

  const quantity = req.body.quantity || 1;
  const price = product.priceAfterDiscount || product.price;
  const color = product.colors?.length > 0 ? req.body.color : undefined;

  if (product.quantity < quantity) {
    return next(new AppError('Not enough stock available', 400));
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // Create new cart if not found
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: req.body.product,
          quantity,
          price,
          ...(color && { color })
        }
      ]
    });
  } else {
    // Check if item with same product+color exists
    const productIndex = cart.cartItems.findIndex(
      (item) =>
        item.product.toString() === req.body.product &&
        (item.color === color || (!item.color && !color))
    );

    if (productIndex > -1) {
      // If exists, increase quantity
      cart.cartItems[productIndex].quantity += quantity;
    } else {
      // Otherwise, add new item
      cart.cartItems.push({
        product: req.body.product,
        quantity,
        price,
        ...(color && { color })
      });
    }
  }

  await cart.updateCartTotals();
  await cart.save();

  return res.status(200).json({
    status: 'success',
    message: 'Cart updated successfully',
    data: { cart }
  });
});

// Remove specific item from cart
exports.removeItemFromCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new AppError('You have no cart, please add items first', 404));

  const initialLength = cart.cartItems.length;

  // Remove item with matching product and color
  cart.cartItems = cart.cartItems.filter(
    (item) =>
      !(
        item.product.toString() === req.params.id &&
        (item.color === req.body.color || (!item.color && !req.body.color))
      )
  );

  if (cart.cartItems.length === initialLength) {
    return next(new AppError('This product is not in your cart', 404));
  }

  await cart.updateCartTotals();
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Item removed from cart',
    data: { cart }
  });
});

// Remove all items from user's cart
exports.clearCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new AppError('You have no cart to clear', 404));

  cart.cartItems = [];
  await cart.updateCartTotals();
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Cart cleared successfully',
    data: { cart }
  });
});

// Update quantity of a specific item (or add it if not found)
exports.updateCartItemQuantity = catchAsync(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id });
  const product = await Product.findById(req.params.id);
  if (!product) return next(new AppError('No product found with this ID', 404));

  const hasColors = product.colors?.length > 0;
  let color = hasColors ? req.body.color : undefined;

  // If product supports colors but no color is provided
  if (hasColors && !req.body.color) {
    const sameProductItems = cart?.cartItems.filter(
      (item) => item.product.toString() === req.params.id
    );

    // If only one variant exists in the cart, use its color
    if (sameProductItems?.length === 1) {
      color = sameProductItems[0].color;
    } else {
      return next(
        new AppError(
          'Color is required because you have multiple variants of this product in the cart.',
          400
        )
      );
    }
  }

  // If product does not support colors but color is sent
  if (!hasColors && req.body.color) {
    return next(new AppError('This product does not support colors', 400));
  }

  // If provided color is invalid
  if (hasColors && color && !product.colors.includes(color)) {
    return next(
      new AppError(
        `Color "${color}" is not available. Available: ${product.colors.join(', ')}`,
        400
      )
    );
  }

  // Quantity must be at least 1
  if (req.body.quantity < 1) {
    return next(new AppError('Quantity must be at least 1', 400));
  }

  // Check available stock
  if (product.quantity < req.body.quantity) {
    return next(new AppError('Not enough stock available', 400));
  }

  const price = product.priceAfterDiscount || product.price;

  if (!cart) {
    // Create new cart if not found
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: req.params.id,
          quantity: req.body.quantity,
          price,
          ...(color && { color })
        }
      ]
    });
  } else {
    // Try to find the item with the same product and color
    const productIndex = cart.cartItems.findIndex(
      (item) =>
        item.product.toString() === req.params.id &&
        (item.color === color || (!item.color && !color))
    );

    if (productIndex > -1) {
      // If exists, update its quantity
      cart.cartItems[productIndex].quantity = req.body.quantity;
    } else {
      // Otherwise, add as a new item
      cart.cartItems.push({
        product: req.params.id,
        quantity: req.body.quantity,
        price,
        ...(color && { color })
      });
    }
  }

  // Recalculate totals and save
  await cart.updateCartTotals();
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Cart updated successfully',
    data: { cart }
  });
});

// Apply a valid coupon to the cart
exports.applyCoupon = catchAsync(async (req, res, next) => {
  const coupon = await Coupon.findOne({ name: req.body.name });
  if (!coupon) return next(new AppError('Coupon not found', 404));
  if (coupon.expire < Date.now()) return next(new AppError('This coupon has expired', 400));

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new AppError('You have no cart to apply coupon on', 404));
  if (cart.appliedCoupon) return next(new AppError('A coupon is already applied', 400));

  cart.appliedCoupon = coupon.name;
  cart.totalPriceAfterDiscount = cart.totalPrice - (cart.totalPrice * coupon.discount) / 100;

  await cart.updateCartTotals();
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Coupon applied successfully',
    data: { cart }
  });
});

// Remove any applied coupon from the cart
exports.removeCoupon = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart || !cart.appliedCoupon) {
    return next(new AppError('No coupon is currently applied to your cart.', 400));
  }

  cart.appliedCoupon = null;
  cart.totalPriceAfterDiscount = undefined;

  await cart.updateCartTotals();
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Coupon removed successfully',
    data: { cart }
  });
});

// Get user's cart with populated product details
exports.getCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'cartItems.product',
    select: 'title price priceAfterDiscount imageCover colors'
  });

  res.status(200).json({
    status: 'success',
    data: { cart }
  });
});
