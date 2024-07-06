const express = require("express");
const router = express.Router();
const Brand = require("../models/brand");
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
  "/brand",
  userAuth,
  adminAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      const brand = new Brand({ ...req.body, owner: req.user._id });
      brand.image = req.file.buffer;
      await brand.save();
      res.status(200).send(brand);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);
router.get("/brands", async (req, res) => {
  try {
    const brands = await Brand.find({});
    if (!brands) {
      return res.status(404).send("No brands is found");
    }
    res.status(200).send(brands);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/brand", userAuth, async (req, res) => {
  try {
    const brand = await Brand.findOne({ name: req.query.brand });
    if (!brand) {
      return res.status(404).send("No brand is found");
    }
    res.status(200).send(brand);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/brands/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (id.length == 24) {
      var brand = await Brand.findById({ _id: id });
    } else {
      var brand = await Brand.findOne({ name: id });
    }
    if (!brand) {
      return res.status(404).send("No brand is found");
    }
    res.status(200).send(brand);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.patch(
  "/brands/:id",
  userAuth,
  adminAuth,
  upload.single("image"),
  async (req, res) => {
    const updates = Object.keys(req.body);
    try {
      console.log(req.params.id);
      const brand = await Brand.findOne({
        _id: req.params.id,
        owner: req.user._id,
      });
      if (!brand) {
        return res.status(404).send("No brand is found");
      }
      updates.forEach((key) => {
        brand[key] = req.body[key];
      });
      brand.image = req.file.buffer;
      await brand.save();
      res.status(200).send(brand);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);
router.delete("/brands/:id", userAuth, adminAuth, async (req, res) => {
  try {
    const _id = req.params.id;
    const brand = await Brand.findByIdAndDelete(_id);
    if (!brand) {
      return res.status(404).send("No brand is found");
    }
    res.status(200).send(brand);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
