const express = require("express");
const router = express.Router();
const Feedback = require("../models/feedback");
const userAuth = require("../middelware/userAuth");
router.post("/feedback", userAuth, async (req, res) => {
  try {
    const feedback = new Feedback({
      ...req.body,
      product: req.query.product,
      owner: req.user._id,
    });
    feedback.publishedAt = Feedback.displayTime();
    await feedback.save();
    res.status(200).send(feedback);
  } catch (err) {
    res.status(400).send(err);
  }
});
router.get("/feedbacksOfProduct/:id", userAuth, async (req, res) => {
  try {
    const _id = req.params.id;
    const feedbacks = await Feedback.find({
      product: _id,
    });
    if (!feedbacks) {
      return res.status(404).send("No feedback is found");
    }
    res.status(200).send(feedbacks);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/actor/:id", userAuth, async (req, res) => {
  try {
    const product = req.params.id;
    const feedback = await Feedback.findOne({
      owner: req.user._id,
      product: product,
    });
    if (!feedback) {
      return res.status(404).send("No feedback is found");
    }
    await feedback.populate("owner");
    res.status(200).send(feedback.owner);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/feedbacks/:id", userAuth, async (req, res) => {
  try {
    const product = req.params.id;
    const feedback = await Feedback.findOne({
      owner: req.user._id,
      product: product,
    });
    if (!feedback) {
      return res.status(404).send("No feedback is found");
    }
    res.status(200).send(feedback);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.patch("/feedbacks/:id", userAuth, async (req, res) => {
  try {
    const _id = req.params.id;
    const feedback = await Feedback.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    if (!feedback) {
      return res.status(404).send("No feedback is found");
    }
    res.status(200).send(feedback);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.delete("/feedbacks/:id", userAuth, async (req, res) => {
  try {
    const _id = req.params.id;
    const feedback = await Feedback.findById(_id);
    if (!feedback) {
      return res.status(404).send("No feedback is found");
    }
    res.status(200).send(feedback);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
