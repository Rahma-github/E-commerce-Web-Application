const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  numberOfModel: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
  },
  brand: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },
  classification: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },
  offer: {
    type: Number,
    default: 0,
  },
  quantity: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
  },
  publishedAt: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  image: {
    type: Buffer,
  },
});

productSchema.statics.displayTime = function () {
  var str = "";

  var currentTime = new Date();
  var month = currentTime.getMonth() + 1;
  var date = currentTime.getDate();
  var year = currentTime.getFullYear();
  var hours = currentTime.getHours();
  var minutes = currentTime.getMinutes();
  var seconds = currentTime.getSeconds();

  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  console.log(str);
  str = `${date}/${month}/${year}-${hours % 12}:${minutes}:${seconds}-`;
  if (hours > 11) {
    str += "PM";
  } else {
    str += "AM";
  }
  return str;
};
productSchema.methods.toJSON = function () {
  const productObject = this.toObject();
  return productObject;
};

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
