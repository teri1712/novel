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
  const links = await page.$$("a.dropdown-toggle");
  for (let link of links) {
    let get = await page.evaluate((link) => {
      let text = link.textContent;
      if (text.replace(/[^\x00-\x7F]/g, "").trim() == "Th loi") {
        let uls = link.parentElement.querySelectorAll("ul");
        let listItems = {};
        let limit = 5;
        for (ul of uls) {
          for (li of ul.querySelectorAll("li")) {
            let a = li.querySelector("a");
            listItems[a.textContent] = a.href;
            if (--limit <= 0) {
              break;
            }
          }
          if (limit <= 0) {
            break;
          }
        }
        return listItems;
      }
      return null;
    }, link);
    if (get != null) {
      page.close();
      return get;
    }
  }
  return null;
}

async function crawlNovelsByType(url) {
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });
  const div = await page.$(".list-truyen.col-xs-12");
  const res = await page.evaluate((div) => {
    let res = [];
    let divs = div.querySelectorAll("div.row");

    const limit = 10;
    for (d of divs) {
      let h3 = d.querySelector('h3.truyen-title[itemprop="name"]');
      if (!h3) {
        continue;
      }
      let a = h3.querySelector("a");
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

async function crawlChapter(page, limit) {
  const chapDivs = await page.$$(".col-xs-12.col-sm-6.col-md-6");
  let chaps = {};
  for (let chapDiv of chapDivs) {
    chaps = {
      ...chaps,
      ...(await chapDiv.evaluate((chapDiv) => {
        let getChaps = {};
        let lis = chapDiv.querySelectorAll("li");
        for (li of lis) {
          let a = li.querySelector("a");
          let content = a.textContent;
          let pos_sep = content.indexOf(":");
          let numChap = (
            pos_sep == -1 ? content : content.substring(0, pos_sep)
          ).match(/\d+$/);
          let title = content.substring(pos_sep + 1).trim();
          getChaps[numChap] = { url: a.href, title: title };
        }
        return getChaps;
      }, chapDiv)),
    };
    if (Object.keys(chaps).length >= limit) {
      break;
    }
  }
  return chaps;
}
async function crawlChapterContent(url) {
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  let res = await page.$$eval("p", (elements) => {
    let content = [];
    for (const p of elements) {
      let child = p.firstChild;

      while (child) {
        if (child.nodeType === Node.TEXT_NODE) {
          content.push(child.textContent);
        }
        child = child.nextSibling;
      }
    }
    return content.join("");
  });
  page.close();
  return res;
}

async function crawlDesc(url) {
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  /* crawl book's description */
  const descDoc = await page.$(".col-xs-12.col-sm-8.col-md-8.desc");
  const res = await page.evaluate((descDoc) => {
    return descDoc.querySelector('.desc-text[itemprop="description"]')
      .textContent;
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
  const infoDoc = await page.$(".title-list.book-intro");
  const res = await page.evaluate((info) => {
    let div = info.parentElement;
    let name = div.querySelector("h3.title[itemprop='name']").textContent;
    let thumbnailUrl = div.querySelector("div.book").querySelector("img").src;

    let infoDiv = div.querySelector("div.info").querySelectorAll("div");
    let author = infoDiv[0].querySelector("a").textContent;
    let types = Array.from(infoDiv[1].querySelectorAll("a")).map(
      (a) => a.textContent
    );

    return {
      name: name,
      author: author,
      thumbnailUrl: thumbnailUrl,
      categories: types,
    };
  }, infoDoc);

  /* crawl all chapters */
  let listChap = {};
  const limit = 10;
  while (true) {
    listChap = {
      ...listChap,
      ...(await crawlChapter(page, limit - Object.keys(listChap).length)),
    };
    if (Object.keys(listChap).length >= limit) {
      break;
    }
    const pageBar = await page.$("ul.pagination.pagination-sm");
    if (pageBar == null) {
      break;
    }
    let nextPage = await page.evaluate((pageBar) => {
      let span = pageBar.querySelector("span.glyphicon.glyphicon-menu-right");
      if (span == null) {
        return null;
      }
      return span.parentElement.href;
    }, pageBar);
    if (nextPage == null) {
      break;
    }

    await page.goto(nextPage, {
      waitUntil: "domcontentloaded",
    });
  }
  res.chapters = listChap;
  page.close();
  return res;
}

async function includeToDb() {
  const url = "https://truyenfull.vn/";

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
  const url = "https://truyenfull.vn/";
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
