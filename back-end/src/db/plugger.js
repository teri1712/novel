const fs = require("fs");
const browser = require("./domain/browser.js");
const Novel = require("./models/novel.js");
const Author = require("./models/author.js");
const Chapter = require("./models/chapter.js");
const Supplier = require("./models/supplier.js");

async function init() {
  let sups = await Supplier.find();
  let sources = {};
  for (let sup of sups) {
    let domain_name = sup.domain_name;
    let Crawler = require("./plug-in/" + domain_name + ".js");
    let crawler = new Crawler(await browser);

    sources[domain_name] = crawler;
  }
  return sources;
}

const _sources = init();
async function inluceSource(domain_name, jsfile) {
  let sources = await _sources;
  try {
    fs.writeFileSync("./src/db/plug-in/" + domain_name + ".js", jsfile);

    let Crawler = require("./plug-in/" + domain_name + ".js");
    let crawler = new Crawler(await browser);

    sources[domain_name] = crawler;
    await includeToDb(crawler);
  } catch (error) {
    console.error(error);
  }
}
async function excludeSource(domain_name) {
  let sources = await _sources;
  try {
    let crawler = sources[domain_name];
    if (crawler) {
      console.log("Okk");
      delete sources[domain_name];
      /* unplug completely the module, using common js instead of ES6 
      becase ES6 makes the module static, can't be removed until the end of the app
       */
      delete require.cache[require.resolve("./plug-in/" + domain_name + ".js")];
      await excludeFromDb(crawler);
    }
  } catch (error) {
    console.error(error);
  }
}

async function getCrawler(domain_name) {
  let sources = await _sources;
  if (!domain_name) {
    return Object.values(sources)[0];
  }
  return sources[domain_name];
}

async function includeToDb(crawler) {
  let url = crawler.url;
  let domain_name = crawler.domain_name;

  let supplier = new Supplier({
    url: url,
    domain_name: domain_name,
  });
  await supplier.save();

  console.log("Start crawling from " + url);
  let cates = await crawler.crawlNovelType(url);
  let cached = new Set();
  for (let [key, value] of Object.entries(cates)) {
    let getNovelUrls = await crawler.crawlNovelsByType(value);
    let start = new Date();
    for (let novelUrl of getNovelUrls) {
      if (cached.has(novelUrl)) {
        continue;
      }
      cached.add(novelUrl);
      await includeNovel(supplier, crawler, novelUrl);
    }
    await supplier.save();
    console.log(
      "End parsing " + key + " in " + (new Date() - start) / 1000 + " seconds"
    );
  }
  console.log("....................End.....................");
}

async function includeNovel(supplier, crawler, novelUrl) {
  let novelData = await crawler.crawlNovel(novelUrl);
  let novel = await Novel.findOne({ name: novelData.name });
  let chapters = novelData.chapters;

  if (!novel) {
    let name = novelData.name;
    let thumbnail = novelData.thumbnailUrl;
    let categories = novelData.categories;
    let author = await Author.findOne({ name: novelData.author });
    if (!author) {
      author = new Author({ name: novelData.author });
      await author.save();
    }

    novel = new Novel({
      name: name,
      author: author.id,
      thumbnail: thumbnail,
      url: novelUrl,
      categories: categories,
    });
  }
  for (let [numChap, info] of Object.entries(chapters)) {
    let chapter = await Chapter.findOne({
      number: Number(numChap),
      novel: novel.id,
    });
    if (!chapter) {
      chapter = new Chapter({
        number: Number(numChap),
        title: info.title,
        url: info.url,
        novel: novel.id,
      });
    }
    chapter.suppliers.push({ supplier: supplier.id, url: info.url });
    await chapter.save();
    supplier.chapters.push(chapter.id);
  }
  novel.suppliers.push({ supplier: supplier.id, url: novelUrl });
  supplier.novels.push(novel.id);
  await novel.save();
}

async function excludeFromDb(crawler) {
  let supplier = await Supplier.findOne({ url: crawler.url });
  await supplier.populate("novels");
  await supplier.populate("chapters");
  for (let novel of supplier.novels) {
    for (let i = 0; i < novel.suppliers.length; i++) {
      let s = novel.suppliers[i];
      if (s.supplier == supplier.id) {
        novel.suppliers.splice(i, 1);
        break;
      }
    }
    if (novel.suppliers.length == 0) {
      await novel.deleteOne();
    } else {
      await novel.save();
    }
  }
  for (let chapter of supplier.chapters) {
    for (let i = 0; i < chapter.suppliers.length; i++) {
      let s = chapter.suppliers[i];
      if (s.supplier == supplier.id) {
        chapter.suppliers.splice(i, 1);
        break;
      }
    }
    if (chapter.suppliers.length == 0) {
      await chapter.deleteOne();
    } else {
      await chapter.save();
    }
  }
  await supplier.deleteOne();
}

module.exports = {
  includeNovel,
  inluceSource,
  includeToDb,
  excludeSource,
  getCrawler,
};
