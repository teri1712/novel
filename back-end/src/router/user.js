const { Router } = require("express");
const Novel = require("../db/models/novel.js");
const User = require("../db/models/user.js");
const Author = require("../db/models/author.js");
const UserRead = require("../db/models/userread.js");
const { novelToJson } = require("../controller/utils.js");

const userRouter = Router();

/*note that login first*/
userRouter.get("/recent", async (req, res) => {
  const auth = req.auth;
  try {
    let reads = await UserRead.find({ user: auth.id })
      .sort({ readAt: -1 })
      .populate({
        path: "chapter",
        populate: [
          {
            path: "novel",
            populate: { path: ["author", "suppliers.supplier"] },
          },
        ],
      });
    let novels = await Promise.all(
      reads.map(async (read) => {
        let chapter = read.chapter;
        let novel = chapter.novel;

        let body = await novelToJson(novel);
        body.chapter = { id: chapter.id, name: chapter.title };
        return body;
      })
    );
    res.status(200);
    res.send(novels);
  } catch (error) {
    console.log(error);
    res.status(400);
    res.send("Internal error, try again.");
  }
});


userRouter.get("/attributes", async (req, res) => {
  const auth = req.auth;
  try {
    let user = await User.findById(auth.id);
    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    let attributes = user.attributes;
    res.status(200).json(attributes);
  } catch (error) {
    console.log(error);
    res.status(400).send("Internal error, try again.");
  }
});

userRouter.post("/attributes", async (req, res) => {
  const auth = req.auth;
  try {
    const attributes = req.body;

    let user = await User.findById(auth.id);
    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    user.attributes = attributes;

    await user.save();

    res.status(200).json({ message: 'Attributes saved successfully' });
  } catch (error) {
    console.log(error);
    res.status(400).send("Internal error, try again.");
  }
});


module.exports = userRouter;
