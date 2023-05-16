const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    uniqe: true,
    required: [true, "Silahkan Input Category"]
  },

  item: [{
    type: ObjectId,
    ref: "Item",
  }],
});

module.exports = mongoose.model("Category", categorySchema);
