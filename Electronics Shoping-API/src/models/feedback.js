const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
  },
  publishedAt: {
    type: String,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});
feedbackSchema.statics.displayTime = function () {
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
const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;
