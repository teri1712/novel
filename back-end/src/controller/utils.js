const Novel = require("../db/models/novel.js");
const { plugger } = require("../db/plugger.js");
async function novelsToJson(novels) {
  await Novel.populate(novels, [{ path: "author" }]);
  return Promise.all(
    novels.map(async (novel) => {
      return novelToJson(novel, false);
    })
  );
}
async function novelToJson(novel, d = true) {
  let body = {
    id: novel.id,
    name: novel.name,
    author: novel.author.name,
    url: novel.thumbnail,
    categories: novel.categories,
  };
  if (d) {
    let z = novel.suppliers[0];
    let crawler = await plugger.get(z.supplier.domain_name);
    let desc = await crawler.crawlDesc(z.url);
    body.description = desc;
  }
  return body;
}

async function pNovelToJson(novel, d = true) {
  await novel.populate(["author", "suppliers.supplier"]);
  return novelToJson(novel, d);
}

module.exports = { novelsToJson, novelToJson, pNovelToJson };
