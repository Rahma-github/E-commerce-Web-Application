const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../models/users");
const userAuth = require("../middelware/userAuth");
const adminAuth = require("../middelware/adminAuth");
router.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = user.generateToken();
    res.status(200).send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
});
const upload = multer({
  fileFilter(req, file, cd) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)) {
      return cd(new Error("Please upload image"));
    }
    cd(null, true);
  },
});
router.post(
  "/profileImage",
  userAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      req.user.image = req.file.buffer;
      await req.user.save();
      res.status(200).send(req.user.image);
    } catch (err) {
      res.status(500).send(err);
    }
  }
);
router.get("/profile", userAuth, (req, res) => {
  res.status(200).send(req.user);
});
router.get("/users", userAuth, async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      return res.status(404).send("Not user is found");
    }
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/admin", async (req, res) => {
  try {
    const admin = await User.findOne({ roles: "admin" });
    if (!admin) {
      return res.status(404).send("No user is found");
    }
    res.status(200).send(admin);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/users/:id", userAuth, async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send("No user is found");
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.patch("/profile", userAuth, upload.single("image"), async (req, res) => {
  const updates = Object.keys(req.body);
  try {
    const user = req.user;
    updates.forEach((key) => {
      user[key] = req.body[key];
    });
    if (req.file) {
      user.image = req.file.buffer;
    }
    await user.save();
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});
router.delete("/profile", userAuth, async (req, res) => {
  try {
    const _id = req.user.id;
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      return res.status(404).send(" No item is found");
    }
    res.status(200).send("Success delete");
  } catch (err) {
    res.status(500).send(err);
  }
});
router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = user.generateToken();
    res.status(200).send({ user, token });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});
router.patch("/forgetPassword", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("No acount has this email");
    }
    user.password = req.body.password;
    await user.save();
    const token = user.generateToken();
    res.status(200).send({ user, token });
  } catch (err) {
    res.send(err);
  }
});
const nodemailer = require("nodemailer");
router.post("/send_email", async (req, res) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });
    let mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Verify Your Email",
      html: `<p>Enter ${otp} in the app to verify your email address.</p>`,
    };
    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
      } else {
        console.log(req.body.email);
        res.status(200).send(otp);
      }
    });
  } catch (err) {
    res.status(400).send(err);
  }
});
module.exports = router;
