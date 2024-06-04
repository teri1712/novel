const { default: mongoose } = require("mongoose");
const { getChapterDetail } = require("../src/controller/novel");
const Chapter = require("../src/db/models/chapter");
const Supplier = require("../src/db/models/supplier");
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
  test("Supplier test calls", async () => {
    let chap = await Chapter.findOne({ $where: "this.suppliers.length > 1" });
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
      console.log(res.send.mock.calls[0][0]);
    }
  }, 30000);
});
