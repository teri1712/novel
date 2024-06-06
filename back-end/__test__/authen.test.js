const { default: mongoose } = require("mongoose");
const { signup, login, refreshToken } = require("../src/controller/authen");
const User = require("../src/db/models/user");
const { fitler } = require("../src/router/authen");

describe("Authentication test", function () {
  beforeAll(async () => {
    require("dotenv").config();
    mongoose
      .connect("mongodb://127.0.0.1:27017/novel")
      .then(() => console.log("Novel database connected"))
      .catch((err) => console.log(err));
    await User.deleteOne({ username: "admin" });
  });

  afterAll(async () => {
    mongoose.disconnect();
  });

  let res, req;
  beforeEach(() => {
    res = {
      status: jest.fn(),
      send: jest.fn(),
    };
    req = {};
  });
  test("Try to SignUp with Admin account.", async () => {
    req.body = {
      username: "admin",
      password: "admin",
      role: "admin",
      fullname: "admin",
    };
    await signup(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  }, 3000);

  test("Try to ReSignUp with Admin account.", async () => {
    req.body = {
      username: "admin",
      password: "admin",
      role: "admin",
      fullname: "admin",
    };
    await signup(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  }, 3000);
  test("Try to Login with wrong password.", async () => {
    req.body = {
      username: "admin",
      password: "vcl",
    };
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith("Wrong password");
  }, 3000);

  test("Try to Login with wrong username.", async () => {
    req.body = {
      username: "vcl",
      password: "admin",
    };
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith("Username does not exist");
  }, 3000);

  let tokens;
  test("Try to Login with Admin account.", async () => {
    req.body = {
      username: "admin",
      password: "admin",
    };
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    tokens = res.send.mock.calls[0][0];
    console.log(tokens);
  }, 3000);
  test("Try to Grant access with the tokens.", async () => {
    req.headers = {
      authorization: "Bearer " + tokens.accessToken,
    };
    req.originalUrl = "/u/";
    next = jest.fn();
    await fitler(req, res, next);
    expect(next).toHaveBeenCalledWith();
  }, 3000);
  test("Try to Refresh the tokens.", async () => {
    req.body = tokens.refreshToken;
    await refreshToken(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  }, 3000);
  test("Try to Access in anonymous mode.", async () => {
    req.headers = {};
    req.originalUrl = "/novels/";
    req.next = jest.fn();
    await fitler(req, res, next);
    expect(next).toHaveBeenCalledWith();
  }, 3000);
});
