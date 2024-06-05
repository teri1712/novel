const { default: mongoose } = require("mongoose");
const {
  getRecommendation,
  getNovelByName,
  getNovelDetail,
  getNovelsByAuthor,
  getChapterDetail,
} = require("../src/controller/novel");
const browser = require("../src/db/domain/browser");
describe("Novel usecase flow test", function () {
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

  let res;
  beforeEach(() => {
    res = {
      status: jest.fn(),
      send: jest.fn(),
    };
  });
  let novel, novelDetail, chapter, chapterDetail;
  test("Take a novel from recommendation", async () => {
    await getRecommendation({}, res);
    expect(res.status).toHaveBeenCalledWith(200);
    let novels = res.send.mock.calls[0][0];
    novel = novels[5];
    console.log(novel);
  }, 5000);
  test("Get the novel by name", async () => {
    await getNovelByName(
      {
        query: {
          title: novel.name,
        },
      },
      res
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });
  test("Get the novel detail", async () => {
    await getNovelDetail(
      {
        params: {
          novelId: novel.id,
        },
      },
      res
    );
    expect(res.status).toHaveBeenCalledWith(200);
    novelDetail = res.send.mock.calls[0][0];
    console.log(novelDetail);
  }, 5000);
  test("Get chapter detail", async () => {
    chapter = novelDetail.chapters[0];
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
    chapterDetail = res.send.mock.calls[0][0];
    console.log(chapterDetail);
  }, 5000);
});
