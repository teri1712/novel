const Novel = require("../db/models/novel.js");
const Prefs = require("../db/models/preference.js");
const { plugger } = require("../db/plugger.js");

async function novelsToJson(novels) {
  return Promise.all(
    novels.map(async (novel) => {
      return novelToJson(novel);
    })
  );
}
async function novelToJson(novel) {
  let body = {
    id: novel.id,
    name: novel.name,
    author: novel.author.name,
    url: novel.thumbnail,
    categories: novel.categories,
  };
  return body;
}
async function novelDetailToJson({ novel, userId, domain_name }) {
  let body = await novelToJson(novel);
  await novel.populate("suppliers.supplier");
  if (!domain_name) {
    let domains = novel.suppliers.map((sup) => sup.supplier.domain_name);
    domain_name = await defaultDomain(userId, domains);
  }
  let url = novel.suppliers.find(
    (z) => z.supplier.domain_name === domain_name
  ).url;
  let crawler = await plugger.get(domain_name);
  let desc = await crawler.crawlDesc(url);
  body.description = desc;
  body.supplier = domain_name;
  body.suppliers = novel.suppliers.map((z) => z.supplier.domain_name);
  return body;
}

async function defaultDomain(userId, domains) {
  if (!domains) {
    throw "List of domain should be defined";
  }
  let sups = await Prefs.find({ user: userId }).sort({ order: -1 });
  for (let sup of sups) {
    if (domains.includes(sup.domain_name)) {
      return sup.domain_name;
    }
  }
  return domains[0];
}

module.exports = {
  novelsToJson,
  novelToJson,
  defaultDomain,
  novelDetailToJson,
};
