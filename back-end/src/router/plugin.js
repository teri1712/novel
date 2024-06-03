const { Router } = require("express");
const { plugger } = require("../db/plugger.js");
const User = require("../db/models/user.js");

const pluginRouter = Router();

pluginRouter.post("/plug/:domain_name", async (req, res) => {
  const { domain_name } = req.params;
  plugger.includePlugin(domain_name, req.body);
  res.status(200);
  res.send("In progress");
});

pluginRouter.put("/unplug", async (req, res) => {
  const { domain_name } = req.query;
  plugger.excludePlugin(domain_name);
  res.status(200);
  res.send("In progress");
});

module.exports = pluginRouter;
