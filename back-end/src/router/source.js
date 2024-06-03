const { Router } = require("express");
const { inluceSource, excludeSource } = require("../db/plugger.js");
const User = require("../db/models/user.js");

const sourceRouter = Router();

sourceRouter.post("/import/:domain_name", async (req, res) => {
  const { domain_name } = req.params;
  inluceSource(domain_name, req.body);
  res.status(200);
  res.send("In progress");
});

sourceRouter.put("/remove", async (req, res) => {
  const { domain_name } = req.query;
  excludeSource(domain_name);
  res.status(200);
  res.send("In progress");
});

module.exports = sourceRouter;
