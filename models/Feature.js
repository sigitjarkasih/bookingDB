const mongoose = require("mongoose");
// const { mongoose } = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const featureSchema = new mongoose.Schema({
  featureName: {
    type: String,
    required: [true, "Silahkan Input Nama Feature"],
  },

  qty: {
    type: Number,
    required: [true, "Silahkan Input Nama Feature Quantity"],
  },

  imageUrl: {
    type: String,
    required: true,
  },

  item: [
    {
      type: ObjectId,
      ref: "Item",
    },
  ],
});

module.exports = mongoose.model("Feature", featureSchema);
