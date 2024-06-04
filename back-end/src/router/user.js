const { Router } = require("express");
const Novel = require("../db/models/novel.js");
const User = require("../db/models/user.js");
const Author = require("../db/models/author.js");
const UserRead = require("../db/models/userread.js");
const { novelToJson } = require("../controller/utils.js");

const userRouter = Router();

/*note that login first*/
userRouter.get("/recent", async (req, res) => {
  const { auth } = req.session.authenContext;
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

module.exports = userRouter;
