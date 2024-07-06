const express = require("express");
const router = express.Router();
const News = require("../models/new");
const userAuth = require("../middelware/userAuth");
const adminAuth = require("../middelware/adminAuth");
const multer = require("multer");
const upload = multer({
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|jfif|avif|webp)$/)) {
      return cb(new Error("Please upload image"));
    }
    cb(null, true);
  },
});
router.post(
  "/new",
  userAuth,
  adminAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      const New = new News({ ...req.body, owner: req.user._id });
      New.image = req.file.buffer;
      New.publishedAt = News.displayTime();
      await New.save();
      res.status(200).send(New);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);
router.get("/news", async (req, res) => {
  try {
    console.log(11);

    const New = await News.find({});
    if (!New) {
      return res.status(404).send("No New is found");
    }
    res.status(200).send(New);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/news/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const New = await News.findById(_id);
    if (!New) {
      return res.status(404).send("No new is found");
    }
    res.status(200).send(New);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.patch(
  "/news/:id",
  userAuth,
  adminAuth,
  upload.single("image"),
  async (req, res) => {
    const updates = Object.keys(req.body);
    try {
      const New = await News.findOne({
        _id: req.params.id,
        owner: req.user._id,
      });
      if (!New) {
        return res.status(404).send("No new is found");
      }
      updates.forEach((key) => {
        New[key] = req.body[key];
      });
      New.image = req.file.buffer;
      await New.save();
      res.status(200).send(New);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);
router.delete("/news/:id", userAuth, adminAuth, async (req, res) => {
  try {
    const _id = req.params.id;
    const New = await News.findOneAndDelete({ _id, owner: req.user._id });
    if (!New) {
      return res.status(404).send("No new is found");
    }
    res.status(200).send(New);
  } catch (err) {
    res.status(500).send(err);
  }
});
module.exports = router;
