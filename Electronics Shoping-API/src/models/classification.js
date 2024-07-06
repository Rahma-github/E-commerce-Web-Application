const mongoose = require("mongoose");

const classificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
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
classificationSchema.methods.toJSON = function () {
  const classificationObject = this.toObject();
  return classificationObject;
};

const Classification = mongoose.model("Classification", classificationSchema);
module.exports = Classification;
