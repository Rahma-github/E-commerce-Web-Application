const express = require("express");
const router = express.Router();
const Classification = require("../models/classification");
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
  "/classification",
  userAuth,
  adminAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      const classification = new Classification({
        ...req.body,
        owner: req.user._id,
      });
      classification.image = req.file.buffer;
      await classification.save();
      res.status(200).send(classification);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);
router.get("/classifications", async (req, res) => {
  try {
    const classifications = await Classification.find({});
    if (!classifications) {
      return res.status(404).send("No Classifications is found");
    }
    res.status(200).send(classifications);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/classifications/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (id.length == 24) {
      var classification = await Classification.findById({ _id: id });
    } else {
      var classification = await Classification.findOne({ name: id });
    }
    if (!classification) {
      return res.status(404).send("No Classification is found");
    }
    res.status(200).send(classification);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/classification", async (req, res) => {
  try {
    const classification = await Classification.findOne({
      name: req.query.classification,
    });
    if (!classification) {
      return res.status(404).send("No Classification is found");
    }
    res.status(200).send(classification);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.patch(
  "/classifications/:id",
  userAuth,
  adminAuth,
  upload.single("image"),
  async (req, res) => {
    const updates = Object.keys(req.body);
    try {
      const classification = await Classification.findOne({
        _id: req.params.id,
        owner: req.user._id,
      });
      if (!classification) {
        return res.status(404).send("No Classification is found");
      }
      updates.forEach((key) => {
        classification[key] = req.body[key];
      });
      classification.image = req.file.buffer;
      await classification.save();
      res.status(200).send(classification);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);
router.delete("/classifications/:id", userAuth, adminAuth, async (req, res) => {
  try {
    const _id = req.params.id;
    const classification = await Classification.findByIdAndDelete(_id);
    if (!classification) {
      return res.status(404).send("No classifications is found");
    }
    res.status(200).send(classification);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
