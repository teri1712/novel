import Novel from "../db/models/novel.js";
import { crawlDesc } from "../db/domain/truyenfull/crawler.js";
export async function novelsToJson(novels) {
  await Novel.populate(novels, [{ path: "author" }]);
  return Promise.all(
    novels.map(async (novel) => {
      return novelToJson(novel);
    })
  );
}
export async function novelToJson(novel) {
  console.log(novel.suppliers[0].url);
  let desc = await crawlDesc(novel.suppliers[0].url);
  return {
    id: novel.id,
    name: novel.name,
    author: novel.author.name,
    description: desc,
    url: novel.thumbnail,
    categories: novel.categories,
  };
}

export async function pNovelToJson(novel) {
  await novel.populate("author");
  return novelToJson(novel);
}
