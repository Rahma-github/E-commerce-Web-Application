const express = require("express");
const router = express.Router();
const Product = require("../models/product");
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
  "/product",
  userAuth,
  adminAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      const product = new Product({ ...req.body, owner: req.user._id });
      console.log(product);
      product.image = req.file.buffer;
      product.publishedAt = Product.displayTime();
      await product.save();
      res.status(200).send(product);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);
router.get("/productsHome", async (req, res) => {
  try {
    const products = await Product.find({});
    // ({
    //   random_point: { $near: [Math.random(), 0] },
    // }).limit(4);
    if (!products) {
      return res.status(404).send("No products is found");
    }
    res.status(200).send(products);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/products", userAuth, async (req, res) => {
  try {
    await req.user.populate("product");
    res.status(200).send(req.user.product);
    console.log(req.user.product);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/products/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const product = await Product.findById(_id);
    if (!product) {
      return res.status(404).send("No product is found");
    }
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/productsGallery", async (req, res) => {
  try {
    const product = await Product.find({});
    if (!product) {
      return res.status(404).send("No product is found");
    }
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/productBrand", async (req, res) => {
  try {
    const products = await Product.find({ brand: req.query.brand });
    if (!products) {
      return res.status(404).send("No products is found");
    }
    res.status(200).send(products);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/productClassification", async (req, res) => {
  try {
    const products = await Product.find({
      classification: req.query.classification,
    });
    if (!products) {
      return res.status(404).send("No products is found");
    }
    res.status(200).send(products);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/offers", async (req, res) => {
  try {
    const products = await Product.find({ offer: { $gt: 0 } });
    if (!products) {
      return res.status(404).send("No products is found");
    }
    res.status(200).send(products);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/rating", async (req, res) => {
  try {
    const products = await Product.find({ rating: { $lt: 2 } });
    if (!products) {
      return res.status(404).send("No products is found");
    }
    res.status(200).send(products);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/createdBy/:id", userAuth, adminAuth, async (req, res) => {
  try {
    const _id = req.params.id;
    const product = await Product.findById(_id);
    if (!product) {
      return res.status(404).send("No product is found");
    }
    await product.populate("owner");
    res.status(200).send(product.owner);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.patch("/updateQuantity/:id", userAuth, async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
  });
  if (!product) {
    return res.status(404).send("No product is found");
  }
  product.quantity = req.body.quantity;
  await product.save();
  res.status(200).send(product);
});
router.patch("/updateRating/:id", userAuth, async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
  });
  if (!product) {
    return res.status(404).send("No product is found");
  }
  product.rating = req.body.rating;
  await product.save();
  res.status(200).send(product);
});
router.patch("/UpdateOffer/:id", userAuth, async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
  });
  if (!product) {
    return res.status(404).send("No product is found");
  }
  product.offer = req.body.offer;
  await product.save();
  res.status(200).send(product);
});
router.patch(
  "/products/:id",
  userAuth,
  adminAuth,
  upload.single("image"),
  async (req, res) => {
    const updates = Object.keys(req.body);
    try {
      const _id = req.params.id;
      const product = await Product.findOne({
        _id: req.params.id,
        owner: req.user._id,
      });
      if (!product) {
        return res.status(404).send("No product is found");
      }
      updates.forEach((key) => {
        product[key] = req.body[key];
      });
      product.image = req.file.buffer;
      await product.save();
      res.status(200).send(product);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);
router.delete("/products/:id", userAuth, adminAuth, async (req, res) => {
  try {
    const _id = req.params.id;
    const product = await Product.findOneAndDelete({
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
