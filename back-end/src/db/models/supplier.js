const mongoose = require("mongoose");

const Supplier = new mongoose.Schema({
  domain_name: {
    type: mongoose.SchemaTypes.String,
    require: true,
  },
  url: {
    type: mongoose.SchemaTypes.String,
    require: true,
  },
  novels: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Novel",
    },
  ],
  chapters: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Chapter",
    },
  ],
});
module.exports = mongoose.model("Supplier", Supplier);
