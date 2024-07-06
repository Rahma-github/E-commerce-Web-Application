const express = require("express");
const router = express.Router();
const Crad = require("../models/card");
const userAuth = require("../middelware/userAuth");
router.post("/addproduct", userAuth, async (req, res) => {
  try {
    const product = new Crad({ ...req.body, owner: req.user._id });
    product.addAt = Crad.displayTime();
    await product.save();
    res.status(200).send(product);
  } catch (err) {
    // res.status(400).send(err);
    console.log(err);
  }
});
router.get("/productsOfCard", userAuth, async (req, res) => {
  try {
    await req.user.populate("Card");
    res.status(200).send(req.user.Card);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/productOfCard/:id", userAuth, async (req, res) => {
  try {
    const _id = req.params.id;
    const productOfCard = await Crad.findById(_id);
    if (!productOfCard) {
      return res.status(404).send("No product is found at card");
    }
    await productOfCard.populate("product");
    res.status(200).send(productOfCard.product);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/productsOfCard/:id", userAuth, async (req, res) => {
  try {
    const _id = req.params.id;
    const productOfCard = await Crad.findOne({
      owner: req.user._id,
      product: _id,
    });
    if (!productOfCard) {
      return res.status(404).send("No product is found at card");
    }
    res.status(200).send(productOfCard);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.delete("/productOfCard/:id", userAuth, async (req, res) => {
  try {
    const _id = req.params.id;
    const product = await Crad.findOneAndDelete({ _id, owner: req.user._id });
    if (!product) {
      return res.status(404).send("No product is found at card");
    }
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
