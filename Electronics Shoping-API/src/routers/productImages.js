const express = require("express");
const router = express.Router();
const Image = require("../models/productImages");
const userAuth = require("../middelware/userAuth");
const adminAuth = require("../middelware/adminAuth");
const multer = require("multer");
const upload = multer({
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|jfif|avif)$/)) {
      return cb(new Error("Please upload image"));
    }
    cb(null, true);
  },
});
router.post(
  "/addImage/:id",
  userAuth,
  adminAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      const img = new Image({ product: req.params.id });
      img.image = req.file.buffer;
      await img.save();
      res.status(200).send(img);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);
router.get("/images/:id", userAuth, async (req, res) => {
  try {
    const _id = req.params.id;
    const image = await Image.findOne({ product: _id });
    if (!image) {
      return res.status(404).send("No image is found");
    }
    res.status(200).send(image);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/imagesOfProduct/:id", userAuth, async (req, res) => {
  try {
    const images = await Image.find({
      product: req.params.id,
    });
    if (!images) {
      return res.status(404).send("No image is found");
    }
    res.status(200).send(images);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.patch(
  "/images/:id",
  userAuth,
  adminAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      const _id = req.params.id;
      const img = await Image.findById(_id);
      if (!img) {
        return res.status(404).send("No image is found");
      }
      img.image = req.file.buffer;
      res.status(200).send(img);
    } catch (err) {
      res.status(500).send(err);
    }
  }
);
router.delete("/images/:id", userAuth, adminAuth, async (req, res) => {
  try {
    const _id = req.params.id;
    const image = await Image.findByIdAndDelete(_id);
    if (!image) {
      return res.status(404).send("No image is found");
    }
    res.status(200).send(image);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
