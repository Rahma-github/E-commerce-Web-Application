const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 2,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
  },
  location: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  createdBy: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  dateOfCreation: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
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
brandSchema.methods.toJSON = function () {
  const brandObject = this.toObject();
  return brandObject;
};

const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;
