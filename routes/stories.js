const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const Story = require("../models/Story");

//@desc  Show Add page
//@route GET /stories/add
router.get("/add", ensureAuth, (req, res) => {
  res.render("./stories/add");
});

//@desc  Process Add form
//@route POST /stories
router.post("/", ensureAuth, async (req, res) => {
  try {
    //adding user id to object coming from form
    req.body.user = req.user.id;

    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});

//@desc  Show All Stories
//@route GET /stories
router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    res.render("./stories/index", { stories });
  } catch (error) {
    console.log(error);
    res.render("error/500");
  }
});

module.exports = router;
