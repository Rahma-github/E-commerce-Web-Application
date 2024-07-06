const express = require("express");
const router = express.Router();
const Favorite = require("../models/favorite");
const userAuth = require("../middelware/userAuth");
router.post("/addproductOfF", userAuth, async (req, res) => {
  try {
    const product = new Favorite({ ...req.body, owner: req.user._id });
    product.addAt = Favorite.displayTime();
    await product.save();
    res.status(200).send(product);
  } catch (err) {
    res.status(400).send(err);
  }
});
router.get("/productsOfavorite", userAuth, async (req, res) => {
  try {
    await req.user.populate("Favorite");
    res.status(200).send(req.user.Favorite);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/productOfavorite/:id", userAuth, async (req, res) => {
  try {
    const _id = req.params.id;
    const productOfFavorite = await Favorite.findById(_id);
    if (!productOfFavorite) {
      return res.status(404).send("No product is found");
    }
    await productOfFavorite.populate("product");
    res.status(200).send(productOfFavorite.product);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.delete("/productsOfavorite/:id", userAuth, async (req, res) => {
  try {
    const _id = req.params.id;
    const product = await Favorite.findOneAndDelete({
      _id,
      owner: req.user._id,
    });
    if (!product) {
      return res.status(404).send("No product is found");
    }
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
