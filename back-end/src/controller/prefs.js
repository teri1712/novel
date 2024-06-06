const Prefs = require("../db/models/preference");
const Supplier = require("../db/models/supplier");

async function delPref(req, res) {
  const { domain_name } = req.query;
  if (!domain_name) {
    throw "Domain should be defined";
  }
  let sup = await Supplier.findOne({ domain_name: domain_name });
  const auth = req.auth;

  let old = await Prefs.findOne({ user: auth.id, supplier: sup.id });
  if (old) {
    await old.deleteOne();
    res.send("Success");
    res.status(200);
  } else {
    res.send("Preference does not exist");
    res.status(400);
  }
}

async function setPref(req, res) {
  let { domain_name, lower_bound } = req.query;
  if (!domain_name) {
    throw "Domain should be defined";
  }
  let sup = await Supplier.findOne({ domain_name: domain_name });
  const auth = req.auth;

  let old = await Prefs.findOne({ user: auth.id, supplier: sup.id });

  if (old) {
    await old.deleteOne();
  }
  if (!lower_bound) {
    let highest = await Prefs.findOne({ user: auth.id }).sort({ order: -1 });
    lower_bound = highest ? highest.order : 0;
  } else {
    await Prefs.updateMany(
      {
        user: auth.id,
        supplier: sup.id,
        order: { $gt: lower_bound },
      },
      {
        $inc: { order: 1 },
      }
    );
  }
  await Prefs.create({
    user: auth.id,
    supplier: sup.id,
    order: lower_bound + 1,
  });
  res.send("Success");
  res.status(200);
}

module.exports = { setPref, delPref };
