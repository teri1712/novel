const { default: mongoose } = require("mongoose");
const { getChapterDetail } = require("../src/controller/novel");
const Chapter = require("../src/db/models/chapter");
const Supplier = require("../src/db/models/supplier");
const browser = require("../src/db/domain/browser");

describe("Supplier test", function () {
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
  test("Test content of chapters for each supplier", async () => {
    let chap = (
      await Chapter.aggregate([
        { $match: { "suppliers.1": { $exists: true } } },
        { $sample: { size: 1 } },
      ]).exec()
    )[0];

    chap = await Chapter.findOne({ _id: chap._id });
    await chap.populate("suppliers.supplier");
    await chap.populate("novel");
    for (let z of chap.suppliers) {
      res = {
        status: jest.fn(),
        send: jest.fn(),
      };
      await getChapterDetail(
        {
          params: {
            novelId: chap.novel.id,
            chapterId: chap.id,
          },
          query: {
            domain_name: z.supplier.domain_name,
          },
        },
        res
      );
      expect(res.status).toHaveBeenCalledWith(200);
      console.log(
        "------------------------" + z.url + "------------------------"
      );
      let chapter = res.send.mock.calls[0][0];
      chapter.content =
        chapter.content.split(" ").slice(0, 50).join(" ") + "...";
      console.log(res.send.mock.calls[0][0]);
    }
  }, 10000);
});
