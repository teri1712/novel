const { default: mongoose } = require("mongoose");
const { signup, login, refreshToken } = require("../src/controller/authen");
const { fitler } = require("../src/router/authen");
const User = require("../src/db/models/user");
const Prefs = require("../src/db/models/preference");
const { getNovelDetail } = require("../src/controller/novel");
const Novel = require("../src/db/models/novel");
const supplier = require("../src/db/models/supplier");
const { setPref, delPref } = require("../src/controller/prefs");
const browser = require("../src/db/domain/browser");

describe("Read novel by Preference flow", function () {
  beforeAll(async () => {
    require("dotenv").config();
    mongoose
      .connect("mongodb://127.0.0.1:27017/novel")
      .then(() => console.log("Novel database connected"))
      .catch((err) => console.log(err));

    let user = await User.findOne({ username: "admin_prefs" });
    if (user) {
      await Prefs.deleteMany({ user: user.id });
      await user.deleteOne();
    }
  });

  afterAll(async () => {
    mongoose.disconnect();
    (await browser).close();
  });

  let res,
    req = {};
  beforeEach(() => {
    res = {
      status: jest.fn(),
      send: jest.fn(),
    };
  });

  test("Try to SignUp with Admin account.", async () => {
    req.body = {
      username: "admin_prefs",
      password: "admin_prefs",
      role: "admin_prefs",
      fullname: "admin_prefs",
    };
    await signup(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    let tokens = res.send.mock.calls[0][0];

    req.headers = {
      authorization: "Bearer " + tokens.accessToken,
    };
    req.originalUrl = "/u/";

    res = {
      status: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
    await fitler(req, res, next);
    expect(next).toHaveBeenCalledWith();
  }, 3000);
  let suppliers;

  test("Try to read Novel without Preferences.", async () => {
    let novel = await Novel.findById({
      _id: "66609e09f3ed5e505bc7aa77",
    }).populate("suppliers.supplier");
    suppliers = novel.suppliers.map((z) => z.supplier);

    req.params = {
      novelId: "66609e09f3ed5e505bc7aa77",
    };
    req.query = {
      domain_name: suppliers[0].domain_name,
    };
    expect((await Prefs.find({ user: req.auth.id })).length).toEqual(0);

    await getNovelDetail(req, res);
    expect(res.status).toHaveBeenCalledWith(200);

    let novelDetail = res.send.mock.calls[0][0];
    console.log(novelDetail);
  }, 10000);

  test("Try to set a Preference", async () => {
    req.query = {
      domain_name: suppliers[0].domain_name,
    };
    await setPref(req, res);
    expect(res.status).toHaveBeenCalledWith(200);

    expect((await Prefs.find({ user: req.auth.id })).length).toEqual(1);
  }, 10000);

  test("Try to delete a Preference.", async () => {
    req.query = {
      domain_name: suppliers[0].domain_name,
    };
    await delPref(req, res);
    expect(res.status).toHaveBeenCalledWith(200);

    await delPref(req, res);
    expect(res.status).toHaveBeenCalledWith(400);

    expect((await Prefs.find({ user: req.auth.id })).length).toEqual(0);
  }, 10000);

  test("Set preference [1st:a,2nd:b] then try to call push b to top", async () => {
    req.query = {
      domain_name: suppliers[1].domain_name,
    };
    await setPref(req, res);
    req.query = {
      domain_name: suppliers[0].domain_name,
    };
    await setPref(req, res);
    expect((await Prefs.find({ user: req.auth.id })).length).toEqual(2);

    req.query = {
      domain_name: suppliers[1].domain_name,
    };
    await setPref(req, res);
    let highest = await Prefs.findOne({ user: req.auth.id }).sort({
      order: -1,
    });

    expect((await Prefs.find({ user: req.auth.id })).length).toEqual(2);
    expect(highest.supplier.toHexString()).toEqual(suppliers[1].id);
  }, 10000);
  test("Try to read Novel preference of b", async () => {
    req.params = {
      novelId: "66609e09f3ed5e505bc7aa77",
    };
    await getNovelDetail(req, res);
    expect(res.status).toHaveBeenCalledWith(200);

    let novelDetail = res.send.mock.calls[0][0];
    console.log(novelDetail);
  }, 10000);
  test("Try to push a to top by lower bound", async () => {
    req.query = {
      domain_name: suppliers[0].domain_name,
    };
    let pref = await Prefs.findOne({
      user: req.auth.id,
      supplier: suppliers[1].id,
    });
    req.query.lower_bound = pref.order;
    await setPref(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  }, 10000);
  test("Try to read Novel preference of a", async () => {
    novel = await Novel.findById({ _id: "66609e09f3ed5e505bc7aa77" }).populate(
      "suppliers.supplier"
    );

    req.params = {
      novelId: "66609e09f3ed5e505bc7aa77",
    };
    await getNovelDetail(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  }, 10000);
});
