const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  dicount: {
    type: Number,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "product",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});
const Offer = mongoose.model("Offer", offerSchema);
module.exports = Offer;
