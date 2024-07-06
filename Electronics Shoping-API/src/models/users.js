const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validatePhoneNumber = require("validate-phone-number-node-js");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: "3",
  },
  username: {
    type: String,
    trim: true,
    minlength: "3",
  },
  myJob: {
    type: String,
    trim: true,
    minlength: "3",
  },
  myFavorite: {
    type: String,
    trim: true,
    minlength: "3",
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  age: {
    type: Number,
    default: 20,
    validate(value) {
      if (value <= 0) {
        throw new Error("Age must be positive number");
      }
    },
  },
  mobile: {
    type: String,
    required: true,
    validate(value) {
      if (!validatePhoneNumber.validate(value)) {
        throw new Error("Mobile is invalid");
      }
    },
  },
  address: {
    type: String,
    required: true,
    trim: true,
    minlength: "3",
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate(value) {
      let regExp = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"
      );
      if (!regExp.test(value)) {
        throw new Error("Password must include (a-z) && (A-Z) && (0-9)");
      }
    },
  },
  image: {
    type: Buffer,
  },
  roles: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});
userSchema.virtual("product", {
  localField: "_id",
  foreignField: "owner",
  ref: "Product",
});
userSchema.virtual("brand", {
  localField: "_id",
  foreignField: "owner",
  ref: "Brand",
});
userSchema.virtual("new", {
  localField: "_id",
  foreignField: "owner",
  ref: "New",
});
userSchema.virtual("Card", {
  localField: "_id",
  foreignField: "owner",
  ref: "Card",
});
userSchema.virtual("Favorite", {
  localField: "_id",
  foreignField: "owner",
  ref: "Favorite",
});
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, 8);
  }
});
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Please check email or password");
  }
  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Please check email or password");
  }
  return user;
};
userSchema.methods.generateToken = function () {
  const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);
  return token;
};
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
