const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

async function crawlHotNovel(baseUrl) {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
      await page.goto(baseUrl, { waitUntil: 'networkidle0' });

      const htmlContent = await page.content();

      const $ = cheerio.load(htmlContent);

      const data = [];

      $('.index-intro .item').each((index, element) => {
        const title = $(element).find('.title h3').text();
        const url = $(element).find('a').attr('href');
        const imageUrl = $(element).find('img').attr('src');
        data.push({ title, url, imageUrl });
      });



      fs.writeFileSync('hotnovels.json', JSON.stringify(data, null, 2));

    } catch (error) {
      console.error('Error:', error);
    } finally {
      await browser.close();
    }
}


async function crawlNewNovel(baseUrl) {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto(baseUrl, { waitUntil: 'networkidle0' });

    const htmlContent = await page.content();

    const $ = cheerio.load(htmlContent);

    const data = [];

    $('.list-truyen .row').each((index, element) => {
      const title = $(element).find('.col-title h3 a').text().trim();
      const url = $(element).find('.col-title h3 a').attr('href');
      const genres = [];
      $(element).find('.col-cat a').each((i, el) => {
        genres.push($(el).text());
      });
      const chapter = $(element).find('.col-chap a').text().trim();
      const time = $(element).find('.col-time').text().trim();

      data.push({ title, url, genres, chapter, time });
    });

    fs.writeFileSync('newnovels.json', JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

async function crawlNovelType(baseUrl) {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto(baseUrl, { waitUntil: 'networkidle0' });

    const htmlContent = await page.content();

    const $ = cheerio.load(htmlContent);

    const data = [];

    $('.list-truyen .row .col-xs-6 a').each((index, element) => {
        const title = $(element).text().trim();
        const url = $(element).attr('href');
        data.push({ title, url });
    });

    fs.writeFileSync('noveltypes.json', JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

async function crawlChapter(baseUrl, storySlug, chapterSlug) {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    const url = `${baseUrl}/${storySlug}/${chapterSlug}/`;
    await page.goto(url, { waitUntil: 'networkidle0' });

    const htmlContent = await page.content();

    const $ = cheerio.load(htmlContent);

    const data = [];


    const storyTitle = $('.truyen-title').text().trim();

    const chapterTitle = $('.chapter-title').text().trim();

    const chapterContent = $('#chapter-c').contents().filter(function() {
      return this.nodeType === 3; // Chỉ lấy các nút văn bản
    }).text().trim();

    data.push({ storyTitle, chapterTitle, chapterContent });

    fs.writeFileSync('chapter.json', JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}



crawlHotNovel('https://truyenfull.vn');
crawlNewNovel('https://truyenfull.vn');
crawlNovelType('https://truyenfull.vn');
crawlChapter('https://truyenfull.vn', 'ngao-the-dan-than', 'chuong-1');
