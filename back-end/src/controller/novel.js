const { Router } = require("express");
const Novel = require("../db/models/novel.js");
const User = require("../db/models/user.js");
const Author = require("../db/models/author.js");
const {
  novelToJson,
  novelsToJson,
  defaultDomain,
  novelDetailToJson,
} = require("./utils.js");
const Chapter = require("../db/models/chapter.js");
const UserRead = require("../db/models/userread.js");
const { plugger } = require("../db/plugger.js");

/* Update lượt xem của tiểu thuyết*/
async function updateViews(novelId) {
  return Novel.updateOne({ _id: novelId }, { $inc: { views: 1 } });
}

async function findNovelsByAuthor(req, res, next) {
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
    const fetchedNovels = await Novel.find({ author: author.id }).populate(
      "author"
    );
    const novels = await novelsToJson(fetchedNovels);
    res.status(200);
    res.send(novels);
  } catch (err) {
    console.log(err);
    res.status(400);
  }
}
async function findNovelsByName(req, res, next) {
  let { title, offset } = req.query;
  if (!title) {
    next();
    return;
  }
  if (!offset) {
    offset = 0;
  }
  let query = {
    name: { $regex: title, $options: "i" },
  };
  try {
    const fetchedNovels = await Novel.find(query)
      .skip(offset)
      .limit(10)
      .populate("author");
    let body = {};
    body.novels = await novelsToJson(fetchedNovels);
    body.info = {
      offset: offset,
      length: fetchedNovels.length,
      title: title,
      total: await Novel.countDocuments(query),
    };
    res.status(200);
    res.send(body);
  } catch (err) {
    console.log(err);
    res.status(400);
  }
}
async function findNovelsByYear(req, res, next) {
  const year = req.query.year;
  if (!year) {
    next();
    return;
  }
  try {
    const fetchedNovels = await Novel.find({ year: year }).populate("author");
    const novels = await novelsToJson(fetchedNovels);
    res.status(200);
    res.send(novels);
  } catch (err) {
    console.log(err);
    res.status(400);
  }
}

async function findNovelsByGenre(req, res, next) {
  const genre = req.query.genre;
  if (!genre) {
    next();
    return;
  }
  try {
    const fetchedNovels = await Novel.find({ genre: genre }).populate("author");
    const novels = await novelsToJson(fetchedNovels);
    res.status(200);
    res.send(novels);
  } catch (err) {
    console.log(err);
    res.status(400);
  }
}
async function getRecommendation(req, res) {
  try {
    let query = Novel.find().sort({ views: -1 }).limit(20).populate("author");
    const fetchedNovels = await query;
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
  const { domain_name } = req.query;
  const auth = req.auth;
  try {
    const novel = await Novel.findById(novelId).populate("author");
    if (!novel) {
      res.status(400);
      res.send("Novel does not exist");
      return;
    }
    let novelJson = await novelDetailToJson({
      novel: novel,
      userId: auth ? auth.id : undefined,
      domain_name: domain_name,
    });

    /* Lấy các chương */
    let chaps = await Chapter.find({ novel: novel.id }).sort({ number: 1 });
    novelJson.chapters = chaps.map((chap) => {
      return {
        id: chap.id,
        number: chap.number,
        title: chap.title,
      };
    });
    await updateViews(novelId);

    res.status(200);
    res.send(novelJson);
  } catch (err) {
    console.log(err);
    res.status(400);
  }
}
async function getChapterDetail(req, res) {
  const { novelId, chapterId } = req.params;
  const auth = req.auth;
  let { domain_name } = req.query;

  try {
    const novel = await Novel.findById(novelId).populate("author");
    if (!novel) {
      res.status(400);
      res.send("Novel does not exist.");
      return;
    }
    let chapter = await Chapter.findOne({
      _id: chapterId,
      novel: novelId,
    })
      .sort({
        number: 1,
      })
      .populate("suppliers.supplier");
    if (!chapter) {
      res.status(400);
      res.send("Chapter does not exist");
      return;
    }

    /* body thông tin cơ bản*/
    let body = {};
    let novelJson = await novelToJson(novel);
    body.novel_id = novelJson.id;
    body.chapter_id = chapter.id;
    body.author = novelJson.author;
    body.novel_name = novelJson.name;
    body.chapter_name = chapter.title;
    body.chapter_index = chapter.number;
    body.chapter_name = chapter.title;
    body.categories = novelJson.categories;
    body.total_chapter = await Chapter.countDocuments({ novel: novelId });

    let nextChap = await Chapter.findOne({
      novel: novelId,
      number: chapter.number + 1,
    });
    let preChap = await Chapter.findOne({
      novel: novelId,
      number: chapter.number - 1,
    });

    body.next_chapter = !nextChap
      ? null
      : {
          id: nextChap.id,
          name: nextChap.title,
        };
    body.pre_chapter = !preChap
      ? null
      : {
          id: preChap.id,
          name: preChap.title,
        };

    let suppliers = chapter.suppliers.map((z) => z.supplier.domain_name);
    body.suppliers = suppliers;

    /* Cào nội dung về */
    /* Xác định nguồn sẽ cào về */
    if (!domain_name) {
      domain_name = await defaultDomain(auth ? auth.id : undefined, suppliers);
    }
    /* Lấy crawler tương ứng nguồn được chọn*/
    let crawler = await plugger.get(domain_name);

    /* Tìm url tương ứng nguồn được chọn và cào */
    let url = chapter.suppliers.find(
      (z) => z.supplier.domain_name === domain_name
    ).url;
    body.supplier = domain_name;
    body.content = await crawler.crawlChapterContent(url);

    if (auth) {
      /* Cập nhật lịch sử đọc */
      let preRead = await UserRead.findOne().populate({
        path: "chapter",
        match: { novel: novelId },
      });
      if (preRead) {
        preRead.deleteOne();
      }
      let read = new UserRead({ user: auth.id, chapter: chapterId });
      read.save();
    }

    await updateViews(novelId);

    res.status(200);
    res.send(body);
  } catch (err) {
    console.log(err);
    res.status(400);
  }
}

module.exports = {
  findNovelsByName,
  getNovelDetail,
  findNovelsByAuthor,
  getChapterDetail,
  getRecommendation,
  findNovelsByYear, 
  findNovelsByGenre, 
};
