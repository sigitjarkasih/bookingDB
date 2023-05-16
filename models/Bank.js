const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema({
  bankName: {
    type: String,
    trim: true,
    required: [true, "Silahkan Input Nama Bank"],
  },

  accountNumber: {
    type: String,
    trim: true,
  },

  accountHolder: {
    type: String,
    required: [true, "Silahkan Input Account Holder"],
  },

  imageUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Bank", bankSchema);
