const mongoose = require("mongoose");

const productImageSchema = new mongoose.Schema({
  image: {
    type: Buffer,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
});

productImageSchema.methods.toJSON = function () {
  const imageObject = this.toObject();
  return imageObject;
};

const Image = mongoose.model("Image", productImageSchema);
module.exports = Image;
