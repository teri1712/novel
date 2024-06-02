import { Router } from "express";
import User from "../db/models/user.js";

const authenRouter = Router();

function validate(s) {
  const regex = /^[a-zA-Z0-9_]+$/;
  return regex.test(s);
}

authenRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!validate(username) || !validate(password)) {
    res.status(400).send("Invalid characters");
    return;
  }
  const user = await User.findOne({ username: username });
  if (!user) {
    res.status(401).send("Username does not exist.");
    return;
  }
  if (user.password != password) {
    res.status(401).send("Wrong password.");
    return;
  }
  const authenContext = {
    auth: {
      id: user.id,
      username: user.username,
      password: user.password,
    },
  };
  req.session.authenContext = authenContext;
  // for testing
  console.log(req.session.cookie.maxAge);
  res.status(200).send("Authentication successfully");
});

authenRouter.post("/signup", async (req, res) => {
  const { username, password, fullname, role } = req.body;
  if (!validate(username) || !validate(password)) {
    res.status(400).send("Invalid characters");
    return;
  }
  const user = await User.findOne({ username: username });
  if (user) {
    res.status(400).send("Username exists.");
    return;
  }
  const newAccount = await User.create({
    username: username,
    password: password,
    fullname: fullname,
    role: role,
  });
  //   newAccount.save();

  const authenContext = {
    auth: {
      id: newAccount.id,
      username: newAccount.username,
      password: newAccount.password,
    },
  };
  req.session.authenContext = authenContext;
  res.status(200).send("Authentication successfully");
});

authenRouter.post("/logout", (req, res) => {
  const { authenContext } = req.session;
  if (!authenContext) {
    res.status(400).send("You haven't logined yet.");
    return;
  }
  req.session.destroy((err) => console.log(err));
  res.status(200).send("Authentication successfully");
});

export default authenRouter;
