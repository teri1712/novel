import { Router } from "express";
import Novel from "../db/models/novel.js";
import User from "../db/models/user.js";
import Author from "../db/models/author.js";
import { pNovelToJson, novelsToJson, novelToJson } from "./utils.js";
import Chapter from "../db/models/chapter.js";
import UserRead from "../db/models/userread.js";
import { crawlChapterContent } from "../db/domain/truyenfull/crawler.js";
const novelRouter = Router();
/* Ok */
novelRouter.get("", async (req, res, next) => {
  const authorName = req.query.author;
  if (!authorName) {
    next();
    return;
  }
  try {
    const author = await Author.findOne({ name: authorName });
    if (!author) {
      res.status(400);
      res.send("Author does not exist.");
      return;
    }
    const fetchedNovels = await Novel.find({ author: author.id });
    const novels = await novelsToJson(fetchedNovels);
    res.status(200);
    res.send(novels);
  } catch (err) {
    console.log(err);
    res.status(400);
  }
});
/* Ok */
novelRouter.get("", async (req, res, next) => {
  const title = req.query.title;
  if (!title) {
    next();
    return;
  }
  try {
    const fetchedNovels = await Novel.find({ name: title });
    const novels = await novelsToJson(fetchedNovels);
    res.status(200);
    res.send(novels);
  } catch (err) {
    console.log(err);
    res.status(400);
  }
});
/* Ok */
novelRouter.get("", async (req, res) => {
  try {
    const fetchedNovels = await Novel.aggregate([{ $sample: { size: 10 } }]);
    const novels = await novelsToJson(fetchedNovels);
    res.status(200);
    res.send(novels);
  } catch (err) {
    console.log(err);
    res.status(400);
  }
});
/* Ok */
novelRouter.get("/detail/:novelId", async (req, res) => {
  const novelId = req.params.novelId;
  try {
    const novel = await Novel.findById(novelId);
    if (!novel) {
      res.status(400);
      res.send("Novel does not exist.");
      return;
    }
    let novelJson = await pNovelToJson(novel);
    let chaps = await Chapter.find({ novel: novel.id }).sort({ number: 1 });
    novelJson.chapters = chaps.map((chap) => {
      return {
        id: chap.id,
        number: chap.number,
        title: chap.title,
      };
    });

    res.status(200);
    res.send(novelJson);
  } catch (err) {
    console.log(err);
    res.status(400);
  }
});
/* Ok */
novelRouter.get("/detail/:novelId/:chapterId", async (req, res) => {
  const { novelId, chapterId } = req.params;
  console.log(req.params);
  try {
    const novel = await Novel.findById(novelId);
    if (!novel) {
      res.status(400);
      res.send("Novel does not exist.");
      return;
    }
    let chapter = await Chapter.findOne({
      _id: chapterId,
      novel: novelId,
    }).sort({
      number: 1,
    });
    if (!chapter) {
      res.status(400);
      res.send("Chapter does not exist");
      return;
    }
    let novelJson = await pNovelToJson(novel);
    let body = {};

    body.novel_id = novelJson.id;
    body.chapter_id = chapter.id;
    body.author = novelJson.author;
    body.novel_name = novelJson.name;
    body.chapter_name = chapter.title;
    body.chapter_index = chapter.number;
    body.chapter_name = chapter.name;
    body.cate = novelJson.categories;
    body.total_chapter = await Chapter.countDocuments({ novel: novelId });
    let nextChap = await Chapter.findOne({ number: chapter.number + 1 });
    body.next_chapter = !nextChap
      ? null
      : {
          id: nextChap.id,
          name: nextChap.title,
        };
    body.content = await crawlChapterContent(chapter.suppliers[0].url);

    /* Update the read history */
    let preRead = await UserRead.findOne().populate({
      path: "chapter",
      match: { novel: novelId },
    });

    if (preRead) {
      preRead.deleteOne();
    }
    const { auth } = req.session.authenContext;

    let read = new UserRead({ user: auth.id, chapter: chapterId });
    read.save();

    res.status(200);
    res.send(body);
  } catch (err) {
    console.log(err);
    res.status(400);
  }
});

export default novelRouter;
