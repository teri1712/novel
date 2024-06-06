const { Router } = require("express");
const { setPref, delPref } = require("../controller/prefs");
const prefsRouter = Router();
prefsRouter.put("/set", setPref);
prefsRouter.put("/delete", delPref);

module.exports = prefsRouter;
