const express = require("express");
const router = express.Router();
const Offer = require("../models/offer");
const userAuth = require("../middelware/userAuth");
const adminAuth = require("../middelware/adminAuth");
const multer = require("multer");
const upload = multer({
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)) {
      return cb(new Error("Please upload image"));
    }
    cb(null, true);
  },
});
router.post("/offer/:id", userAuth, async (req, res) => {
  try {
    const offer = new Offer({
      ...req.body,
      product: req.params.id,
      owner: req.user._id,
    });
    await offer.save();
    res.status(200).send(offer);
  } catch (err) {
    res.status(400).send(err);
  }
});
router.get("/offers", userAuth, async (req, res) => {
  try {
    const offers = await Offer.find({});
    if (!offers) {
      return res.status(404).send("No offers is found");
    }
    res.status(200).send(offers);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/offers/:id", userAuth, async (req, res) => {
  try {
    const product = req.params.id;
    const offer = await Offer.findOne({
      product,
      owner: req.user._id,
    });
    if (!offer) {
      return res.status(404).send("No ract is found");
    }
    res.status(200).send(offer);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.patch("/offers/:id", userAuth, async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!offer) {
      return res.status(404).send("No offer is found");
    }
    res.status(200).send(offer);
  } catch (err) {
    res.status(400).send(err);
  }
});
router.delete("/offers/:id", userAuth, async (req, res) => {
  try {
    const product = req.params.id;
    const offer = await Offer.findOneAndDelete({
      product,
      owner: req.user._id,
    });
    if (!offer) {
      return res.status(404).send("No offer is found");
    }
    res.status(200).send(offer);
  } catch (err) {
    res.status(500).send(err);
  }
});
module.exports = router;
