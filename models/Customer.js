const mongoose = require("mongoose");
const validator = require("validator");
const customerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: [true, "Silahkan Input Nama Depan Anda"],
  },

  lastName: {
    type: String,
    trim: true,
    required: [true, "Silahkan Input Nama Nama Belakang Anda"],
  },

  email: {
    type: String,
    required: [true, "Silahkan Input Email Anda"],
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw Error("Periksa Kembali Email Yang Anda Gunakan");
      }
    },
  },

  phoneNumber: {
    type: String,
    required: [true, "Silahkan Input Nomor Telpon Anda"],
  },
});

module.exports = mongoose.model("Customer", customerSchema);
