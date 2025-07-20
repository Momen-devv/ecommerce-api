# E-commerce API

This project is a RESTful API backend for an online store, built with **Node.js** and **Express.js**. It uses **MongoDB** for data storage and Mongoose for object modeling. The API provides user authentication (with JWT tokens) and supports full CRUD operations for products, categories, brands, carts, wishlists, reviews, and addresses. It also handles order processing using Stripe for payment and Twilio for SMS notifications. The code follows modern security best practices: Helmet middleware sets secure HTTP headers, `express-rate-limit` limits repeated requests, `express-mongo-sanitize` removes dangerous MongoDB operators, and HPP guards against HTTP Parameter Pollution. File uploads are handled with Multer and stored on Cloudinary, and Nodemailer is used for sending transactional emails.

## Key Features

- **User Authentication:** Secure signup/login using JWT and hashed passwords.
- **Product Management:** Full CRUD for products with image upload and cloud storage.
- **Categories & Brands:** Manage product categories and brand entities.
- **Shopping Cart & Wishlist:** Add/remove products, view totals, and manage favorite items.
- **Product Reviews:** Authenticated users can review and rate products.
- **Addresses:** Create and manage multiple user addresses for shipping/billing.
- **Orders & Checkout:** Process orders with Stripe payment integration.
- **SMS Verification:** Send OTP codes via Twilio Verify API.
- **Email Notifications:** Send password reset and order confirmations via Nodemailer.
- **Security Middleware:** Includes Helmet, rate limiting, input sanitization, and XSS protection.

## Technologies Used

| Category           | Tools & Libraries                                            |
| ------------------ | ------------------------------------------------------------ |
| **Core**           | Node.js, Express.js                                          |
| **Database**       | MongoDB, Mongoose                                            |
| **Authentication** | JWT, bcryptjs                                                |
| **Payments**       | Stripe                                                       |
| **SMS**            | Twilio                                                       |
| **Email**          | Nodemailer                                                   |
| **File Upload**    | Multer, Cloudinary                                           |
| **Security**       | helmet, express-rate-limit, express-mongo-sanitize, hpp, xss |
| **Validation**     | joi                                                          |
| **Environment**    | dotenv                                                       |
| **Logging**        | morgan                                                       |
| **Utilities**      | slugify, streamifier, compression, cookie-parser             |

## Project Structure

```
├── app.js                     # Express app setup and middleware
├── server.js                  # Entry point of the application
├── package.json               # NPM scripts and dependencies
├── .env                       # Environment variables (not committed)
├── .gitignore                 # Files to exclude from git tracking
├── Middlewares/              # Custom Express middlewares
│   ├── checkBrandExists.js
│   ├── checkCategoryExists.js
│   ├── checkCurrentPasswordCorrect.js
│   ├── checkProductExists.js
│   ├── checkSubcategoriesBelongToCategory.js
│   ├── checkSubcategoriesExists.js
│   ├── checkUserExists.js
│   ├── deleteImages.js
│   ├── setUserId.js
│   ├── subcategoriesToArray.js
│   ├── uploadImage.js
│   ├── validateShippingAddress.js
│   └── verifyReviewOwner.js
├── controllers/              # Route handler logic (controllers)
│   ├── addressesController.js
│   ├── authController.js
│   ├── brandController.js
│   ├── cartController.js
│   ├── categoryController.js
│   ├── couponController.js
│   ├── errorController.js
│   ├── handlerFactory.js
│   ├── orderController.js
│   ├── productController.js
│   ├── reviewController.js
│   ├── settingsController.js
│   ├── subCategoryController.js
│   ├── userController.js
│   └── wishlistController.js
├── models/                   # Mongoose models (schemas)
│   ├── brandModel.js
│   ├── cartModel.js
│   ├── categoryModel.js
│   ├── couponModel.js
│   ├── orderModel.js
│   ├── productModel.js
│   ├── reviewModel.js
│   ├── settingsModel.js
│   ├── subCategoryModel.js
│   └── userModel.js
├── routes/                   # Route definitions (not shown above but assumed)
├── db/
│   └── connect.js            # MongoDB connection logic
├── dev/data/                # Development seed data
│   ├── brands.json
│   ├── categories.json
│   ├── coupons.json
│   ├── fakeUsers.json
│   ├── import-dev-data.js
│   ├── products.json
│   ├── reviews.json
│   ├── settings.json
│   └── subcategories.json
├── utils/                   # Utility functions
│   ├── appError.js
│   ├── catchAsync.js
│   ├── cloudinary.js
│   ├── email.js
│   ├── imageCleanup.js
│   └── sendSMS.js
```

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Momen-devv/ecommerce-api.git
   cd ecommerce-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create your `.env` file (see section below)

4. Start the development server:
   ```bash
   npm run start:dev
   ```

## Environment Variables

Create a `.env` file with the following keys:

```env
PORT=3000
NODE_ENV=development

DB_URL=your_mongodb_connection_string
BASE_URL=http://localhost:3000

JWT_SECRET_KEY=your_jwt_secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

CRYPTO_SECRET=your_crypto_token

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=your_email@gmail.com

SENDGRID_USERNAME=apikey
SENDGRID_PASSWORD=your_sendgrid_api_key

TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_VERIFY_SERVICE_SID=your_twilio_verify_sid

STRIPE_SECRET=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

## API Documentation

Full documentation and testable endpoints are available on Postman:

[Postman Documentation](https://documenter.getpostman.com/view/43275507/2sB34kEeNg)

## Author

**Momen Elshamy**

- GitHub: [@Momen-elshamy](https://github.com/Momen-devv)
- LinkedIn: [momen-elshamy](https://www.linkedin.com/in/momen-elshamy-450893357/)
- Email: momen.abdelraouf.elshamy@gmail.com
