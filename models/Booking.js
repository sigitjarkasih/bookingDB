const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const bookingSchema = new mongoose.Schema({
  bookingStartDate: {
    type: Date,
    required: [true, "Silahkan Input Tanggal Booking"],
  },
  bookingEndDate: {
    type: Date,
    required: true,
  },
  invoice: {
    type: String,
    required: true,
  },
  item: {
    _id: {
      type: ObjectId,
      ref: "Item",
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    booked: { type: Number, required: true },
  },
  total: { type: Number, required: true },
  customer: [
    {
      type: ObjectId,
      ref: "Customer",
    },
  ],
  payments: {
    proofPayment: { type: String, required: true }, // Data gambar bukti pembayaran
    bankFrom: { type: String, required: true },
    accountHolder: { type: String, required: true },
    status: { type: String, default: "Process" },
  },

  profBy: {
    type: ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
