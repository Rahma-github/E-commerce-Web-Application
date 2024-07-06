const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  addAt: {
    type: String,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

cardSchema.statics.displayTime = function () {
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

const Crad = mongoose.model("Card", cardSchema);
module.exports = Crad;
