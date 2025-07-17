const express = require('express');
const authController = require('../controllers/authController');

const { updateSettings, getSettings } = require('../controllers/settingsController');
const { validateUpdateSettings } = require('../validators/settings.validator');

const router = express.Router();

// Protected routes (admin only)
router.use(authController.protect, authController.restricTo('admin'));

router.route('/').post(validateUpdateSettings, updateSettings).get(getSettings);

module.exports = router;
