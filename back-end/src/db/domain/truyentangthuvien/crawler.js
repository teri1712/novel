import puppeteer from "puppeteer";
import Novel from "../../models/novel.js";
import Author from "../../models/author.js";
import Chapter from "../../models/chapter.js";
import Supplier from "../../models/supplier.js";
import browser from "../browser.js";

async function crawlNovelType(url) {
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });
  const link = await page.$("div.classify-list.fl.so-awesome#classify-list");

  let get = await page.evaluate((link) => {
    let crawled = {};
    let as = link.querySelectorAll("a");
    let limit = 5;
    for (a of as) {
      let type = a.querySelector("i").textContent;
      if (type == "Tất cả") {
        continue;
      }
      crawled[type] = a.href;
      if (--limit < 0) {
        break;
      }
    }
    return crawled;
  }, link);
  page.close();
  return get;
}

async function crawlNovelsByType(url) {
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });
  const more = await (await page.$("div.update-tab.cf")).$("a");
  let moreHref = await page.evaluate((a) => a.href, more);
  await page.goto(moreHref, {
    waitUntil: "domcontentloaded",
  });
  const div = await (await page.$("div.rank-view-list#rank-view-list")).$("ul");

  const res = await page.evaluate((div) => {
    let res = [];
    let lis = div.querySelectorAll("li");

    const limit = 10;
    for (li of lis) {
      let a = li.querySelector("div.book-mid-info").querySelector("a");
      res.push(a.href);
      if (res.length >= limit) {
        break;
      }
    }
    return res;
  }, div);
  page.close();
  return res;
}

async function crawlChapter(page, chapDiv, limit) {
  let chaps = page.evaluate(
    (chapDiv, limit) => {
      let lis = chapDiv.querySelector("ul.cf").querySelectorAll("li");
      let getChaps = {};
      for (li of lis) {
        let a = li.querySelector("a");
        if (a == null) {
          continue;
        }
        let content = a.title;
        let pos_sep = content.indexOf(":");
        let numChap = (
          pos_sep == -1 ? content : content.substring(0, pos_sep).trim()
        ).match(/\d+$/);
        let title = content.substring(pos_sep + 1).trim();
        getChaps[numChap] = { url: a.href, title: title };

        if (Object.keys(getChaps).length >= limit) {
          break;
        }
      }
      return getChaps;
    },
    chapDiv,
    limit
  );
  return chaps;
}
async function crawlChapterContent(url) {
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  let div = await page.$("div.chapter-c-content");
  let content = await page.evaluate((div) => {
    let divContent = div.querySelector("div.box-chap");
    return divContent.textContent;
  }, div);
  page.close();
  return content;
}

async function crawlDesc(url) {
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  /* crawl book's description */
  const descDoc = await page.$("div.book-intro");
  const res = await page.evaluate((descDoc) => {
    let p = descDoc.querySelector("p");
    let content = [];
    let child = p.firstChild;

    while (child) {
      if (child.nodeType === Node.TEXT_NODE) {
        if (child.textContent.includes("-------")) {
          break;
        }
        content.push(child.textContent);
      }
      child = child.nextSibling;
    }
    return content.join("");
  }, descDoc);
  page.close();
  return res;
}

async function crawlNovel(url) {
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  /* crawl book's info */
  let div = await page.$("div.book-information.cf");
  const res = await page.evaluate((div) => {
    let divInfo = div.querySelector("div.book-info");
    let name = divInfo.querySelector("h1").textContent;
    let thumbnailUrl = div
      .querySelector("div.book-img")
      .querySelector("img").src;

    let tags = divInfo.querySelector("p.tag").querySelectorAll("a");
    let author = "";
    let types = [];
    for (let tag of tags) {
      if (tag.href.includes("the-loai")) {
        types.push(tag.textContent);
      } else if (tag.href.includes("tac-gia")) {
        author = tag.textContent;
      }
    }

    return {
      name: name,
      author: author,
      thumbnailUrl: thumbnailUrl,
      categories: types,
    };
  }, div);

  /* crawl all chapters */
  await page.click("#j-bookCatalogPage");
  div = await page.$("#max-volume");
  let listChap = {};
  const limit = 10;
  while (true) {
    listChap = {
      ...listChap,
      ...(await crawlChapter(page, div, limit - Object.keys(listChap).length)),
    };
    if (Object.keys(listChap).length >= limit) {
      break;
    }
    const pageBar = await page.$(
      'nav.nav-pagination[aria-label="Chapter navigation"]'
    );
    if (pageBar == null) {
      break;
    }
    let nextPage = await page.evaluate((pageBar) => {
      let nxt = pageBar.querySelector('a[aria-label="Next"]');
      if (nxt == null) {
        return false;
      }
      nxt.click();
      return true;
    }, pageBar);
    if (!nextPage) {
      break;
    }
  }
  res.chapters = listChap;
  page.close();
  return res;
}

async function includeToDb() {
  const url = "https://truyen.tangthuvien.vn/";

  let supplier = new Supplier({
    url: url,
  });
  supplier.save();

  console.log("Start crawling from " + url);
  let cates = await crawlNovelType(url);
  let cached = new Set();
  for (let [key, value] of Object.entries(cates)) {
    let getNovelUrls = await crawlNovelsByType(value);
    let start = new Date();
    for (let novelUrl of getNovelUrls) {
      if (cached.has(novelUrl)) {
        continue;
      }
      cached.add(novelUrl);

      let novelData = await crawlNovel(novelUrl);
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
    await supplier.save();
    console.log(
      "End parsing " + key + " in " + (new Date() - start) / 1000 + " seconds"
    );
  }
  console.log("....................End.....................");
}

async function excludeFromDb() {
  const url = "https://truyen.tangthuvien.vn/";
  let supplier = await Supplier.findOne({ url: url });
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
export {
  crawlChapterContent,
  crawlDesc,
  crawlNovel,
  crawlNovelType,
  crawlNovelsByType,
};
export { includeToDb, excludeFromDb };
