const { Router } = require("express");
const { plugger } = require("../db/plugger.js");
const User = require("../db/models/user.js");
const Supplier = require("../db/models/supplier.js");
const Chapter = require("../db/models/chapter.js");
const Novel = require("../db/models/novel.js");
const pluginRouter = Router();

pluginRouter.post("", async (req, res) => {
  let pluggins = Object.keys(await plugger.plugins);
  let body = [];
  for (let pluggin of pluggins) {
    let supplier = await Supplier.findOne({ domain_name: pluggin });
    let total_chapter = await Chapter.countDocuments({
      "suppliers.supplier": supplier.id,
    });
    let total_novel = await Novel.countDocuments({
      "suppliers.supplier": supplier.id,
    });
    body.push({
      supplier: supplier.url,
      total_chapter: total_chapter,
      total_novel: total_novel,
    });
  }
  res.status(200);
  res.send(body);
});

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
