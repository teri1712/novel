const mongoose = require("mongoose");

const Novel = new mongoose.Schema({
  name: {
    type: mongoose.SchemaTypes.String,
    require: true,
  },
  author: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Author",
  },
  thumbnail: {
    type: mongoose.SchemaTypes.String,
    require: true,
  },
  url: {
    type: mongoose.SchemaTypes.String,
    require: true,
  },
  suppliers: [
    {
      supplier: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Supplier",
      },
      url: {
        type: mongoose.SchemaTypes.String,
        require: true,
      },
    },
  ],
  categories: [{ type: mongoose.SchemaTypes.String }],
});
module.exports = mongoose.model("Novel", Novel);
