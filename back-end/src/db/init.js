import mongoose from "mongoose";
import {
  includeToDb,
  excludeFromDb,
  crawlChapterContent,
  crawlDesc,
  crawlNovel,
  crawlNovelType,
  crawlNovelsByType,
} from "./domain/truyenfull/crawler.js";
import browser from "./domain/browser.js";

mongoose
  .connect("mongodb://127.0.0.1:27017/novel")
  .then(() => console.log("Novel database connected"))
  .catch((err) => console.log(err));

async function initDb() {
  await includeToDb();
}
await initDb();
mongoose.disconnect();

// console.log(
//   await crawlChapterContent(
//     "https://truyen.tangthuvien.vn/doc-truyen/cac-nguoi-tu-tien-ta-lam-ruong/chuong-2"
//   )
// );
browser.close();
