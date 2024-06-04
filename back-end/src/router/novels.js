const { Router } = require("express");
const {
  getNovelByName,
  getNovelsByAuthor,
  getRecommendation,
  getNovelDetail,
  getChapterDetail,
} = require("../controller/novel");
const novelRouter = Router();
novelRouter.get("", getNovelsByAuthor);
novelRouter.get("", getNovelByName);
novelRouter.get("", getRecommendation);
novelRouter.get("/detail/:novelId", getNovelDetail);
novelRouter.get("/detail/:novelId/:chapterId", getChapterDetail);

module.exports = novelRouter;
