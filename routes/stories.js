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

//@desc  show edit page
//@route GET /stories/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
  const story = await Story.findOne({
    _id: req.params.id,
  }).lean();
  if (!story) {
    return res.render("error/404");
  }
  if (story.user.toString() !== req.user.id.toString()) {
    res.redirect("/stories");
  } else {
    res.render("stories/edit", { story });
  }
});

//@desc  Update Stories
//@route PUT /stories/:id
router.put("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render("error/404");
    }

    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });

      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

// @desc    Delete story
// @route   DELETE /stories/:id
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render("error/404");
    }

    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      await Story.remove({ _id: req.params.id });
      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

module.exports = router;
