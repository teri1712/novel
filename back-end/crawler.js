const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function crawlData() {
  try {

    const response = await axios.get('https://truyenfull.vn/');

    const $ = cheerio.load(response.data);

    //Cào các truyện mới cập nhật
    const data = [];
    $('table tr').each((index, element) => {
      const row = {

        name: $(element).find('td:nth-child(1)').text(),
        type: $(element).find('td:nth-child(2)').text(),
        chapter: $(element).find('td:nth-child(3)').text(),

      };


      data.push(row);
    });


    fs.writeFileSync('data/database.json', JSON.stringify(data, null, 2));
    console.log('Dữ liệu đã được lưu vào tệp database.json');
  } catch (error) {
    console.error('Lỗi khi thu thập dữ liệu:', error);
  }
}
crawlData();