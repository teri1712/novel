const { Router } = require("express");
const Novel = require("../db/models/novel.js");
const User = require("../db/models/user.js");
const Author = require("../db/models/author.js");
const { pNovelToJson, novelsToJson } = require("./utils.js");
const Chapter = require("../db/models/chapter.js");
const UserRead = require("../db/models/userread.js");
const { plugger } = require("../db/plugger.js");

async function getNovelsByAuthor(req, res, next) {
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
}
async function getNovelByName(req, res, next) {
  const title = req.query.title;
  if (!title) {
    next();
    return;
  }
  try {
    const fetchedNovel = await Novel.findOne({ name: title });
    const novel = await pNovelToJson(fetchedNovel);
    res.status(200);
    res.send(novel);
  } catch (err) {
    console.log(err);
    res.status(400);
  }
}
async function getRecommendation(req, res) {
  try {
    const fetchedNovels = await Novel.find().limit(10);
    const novels = await novelsToJson(fetchedNovels);
    res.status(200);
    res.send(novels);
  } catch (err) {
    console.log(err);
    res.status(400);
  }
}
async function getNovelDetail(req, res) {
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
}
async function getChapterDetail(req, res) {
  const { novelId, chapterId } = req.params;
  const { domain_name } = req.query;
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

    await chapter.populate("suppliers.supplier");
    let novelJson = await pNovelToJson(novel, false);
    let body = {};

    body.novel_id = novelJson.id;
    body.chapter_id = chapter.id;
    body.author = novelJson.author;
    body.novel_name = novelJson.name;
    body.chapter_name = chapter.title;
    body.chapter_index = chapter.number;
    body.chapter_name = chapter.title;
    body.cate = novelJson.categories;
    body.total_chapter = await Chapter.countDocuments({ novel: novelId });
    let nextChap = await Chapter.findOne({
      novel: novelId,
      number: chapter.number + 1,
    });
    body.next_chapter = !nextChap
      ? null
      : {
          id: nextChap.id,
          name: nextChap.title,
        };
    body.suppliers = chapter.suppliers.map((z) => z.supplier.domain_name);

    let crawler = await plugger.get(domain_name);
    let url = chapter.suppliers.find(
      (z) => z.supplier.domain_name === crawler.domain_name
    ).url;
    body.content = await crawler.crawlChapterContent(url);

    /* Update the read history */

    // let preRead = await UserRead.findOne().populate({
    //   path: "chapter",
    //   match: { novel: novelId },
    // });

    // if (preRead) {
    //   preRead.deleteOne();
    // }
    // const { auth } = req.session.authenContext;

    // let read = new UserRead({ user: auth.id, chapter: chapterId });
    // read.save();

    res.status(200);
    res.send(body);
  } catch (err) {
    console.log(err);
    res.status(400);
  }
}

module.exports = {
  getNovelByName,
  getNovelDetail,
  getNovelsByAuthor,
  getChapterDetail,
  getRecommendation,
};
