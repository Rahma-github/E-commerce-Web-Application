const mongoose = require("mongoose");

const newSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  select: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },
  PBC: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  publishedAt: {
    type: String,
    required: true,
  },
  image: {
    type: Buffer,
  },
});
newSchema.statics.displayTime = function () {
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
newSchema.methods.toJSON = function () {
  const SliderObject = this.toObject();
  return SliderObject;
};

const New = mongoose.model("New", newSchema);
module.exports = New;
