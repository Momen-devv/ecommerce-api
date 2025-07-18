exports.validateShippingAddress = (req, res, next) => {
  const userAddresses = req.user.addresses;

  // 1. If shippingAddress is manually provided in the request body
  if (req.body.shippingAddress) {
    return next();
  }

  // 2. If addressIndex is provided and valid
  const index = req.body.addressIndex;
  if (typeof index === 'number' && userAddresses[index]) {
    req.body.shippingAddress = userAddresses[index];
    return next();
  }

  // 3. If user has only one saved address, use it automatically
  if (userAddresses.length === 1) {
    req.body.shippingAddress = userAddresses[0];
    return next();
  }

  // 4. If user has multiple addresses but did not specify which one
  if (userAddresses.length > 1) {
    return res.status(400).json({
      status: 'fail',
      message: 'Multiple addresses found. Please select one by passing addressIndex.'
    });
  }

  // 5. No address provided and none found in the user profile
  return res.status(400).json({
    status: 'fail',
    message:
      'No shipping address provided. Please add one to your profile or include it in the request.'
  });
};
