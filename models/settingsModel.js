const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    shippingPrice: {
      type: Number,
      default: 50
    },
    freeShippingThreshold: {
      type: Number,
      default: 10000
    },
    taxRate: {
      type: Number,
      default: 14
    }
  },
  { timestamps: true }
);

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
