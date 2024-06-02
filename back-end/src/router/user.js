import { Router } from "express";
import Novel from "../db/models/novel.js";
import User from "../db/models/user.js";
import Author from "../db/models/author.js";
import UserRead from "../db/models/userread.js";
import { novelToJson } from "./utils.js";
import assert from "assert";
const userRouter = Router();

/*note that login first*/
userRouter.get("/recent", async (req, res) => {
  const { auth } = req.session.authenContext;
  try {
    let reads = await UserRead.find({ user: auth.id })
      .sort({ readAt: -1 })
      .populate({
        path: "chapter",
        populate: [{ path: "novel", populate: { path: "author" } }],
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
  }
});

export default userRouter;
