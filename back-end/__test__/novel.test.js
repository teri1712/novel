const { default: mongoose } = require("mongoose");
const {
  getRecommendation,
  getNovelByName,
  getNovelDetail,
  getNovelsByAuthor,
  getChapterDetail,
} = require("../src/controller/novel");
const browser = require("../src/db/domain/browser");
describe("Novel flow test", function () {
  beforeAll(() => {
    mongoose
      .connect("mongodb://127.0.0.1:27017/novel")
      .then(() => console.log("Novel database connected"))
      .catch((err) => console.log(err));
  });

  afterAll(async () => {
    mongoose.disconnect();
    (await browser).close();
  });

  test("Chain tests", async () => {
    res = {
      status: jest.fn(),
      send: jest.fn(),
    };
    await getRecommendation({}, res);
    expect(res.status).toHaveBeenCalledWith(200);
    let novels = res.send.mock.calls[0][0];
    let novel = novels[5];

    reset(res);
    await getNovelByName(
      {
        query: {
          title: novel.name,
        },
      },
      res
    );
    expect(res.status).toHaveBeenCalledWith(200);

    reset(res);
    await getNovelDetail(
      {
        params: {
          novelId: novel.id,
        },
      },
      res
    );
    expect(res.status).toHaveBeenCalledWith(200);

    let novelDetail = res.send.mock.calls[0][0];
    let chapter = novelDetail.chapters[0];

    reset(res);
    await getChapterDetail(
      {
        params: {
          novelId: novel.id,
          chapterId: chapter.id,
        },
        query: {},
      },
      res
    );
    expect(res.status).toHaveBeenCalledWith(200);
    let chapterDetail = res.send.mock.calls[0][0];
    let suppliers = chapterDetail.suppliers;
    for (let supplier of suppliers) {
      reset(res);
      await getChapterDetail(
        {
          params: {
            novelId: novel.id,
            chapterId: chapter.id,
          },
          query: {
            domain_name: supplier,
          },
        },
        res
      );
      expect(res.status).toHaveBeenCalledWith(200);
    }
  }, 30000);
});

function reset(res) {
  res.status = jest.fn();
  res.send = jest.fn();
}
