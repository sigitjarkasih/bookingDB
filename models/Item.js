const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const itemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    uniqe: true,
    required: [true, "Silahkan Input Item Name"],
  },

  itemPrice: {
    type: Number,
    required: [true, "Silahkan Input Item Price"],
  },

  unit: {
    type: String,
    required: [true, "Silahkan Input Item Unit"],
  },

  sumBooked: {
    type: Number,
    default: 0,
  },

  location: {
    type: String,
    required: [true, "Silahkan Input Location"],
  },

  isPopular: {
    type: Boolean,
    default: false,
  },

  description: {
    type: String,
    required: [true, "Silahkan Input Description"],
  },

  category: {
    type: ObjectId,
    ref: "Category",
  },
  image: [
    {
      type: ObjectId,
      ref: "Image",
    },
  ],
  feature: [
    {
      type: ObjectId,
      ref: "Feature",
    },
  ],
  info: [
    {
      type: ObjectId,
      ref: "Info",
    },
  ],
});

module.exports = mongoose.model("Item", itemSchema);
