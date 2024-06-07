const mongoose = require("mongoose");

const AttributeSchema = new mongoose.Schema({
  selector: {
    type: String,
    required: true,
  },
  properties: {
    type: Map,
    of: String,
    required: true,
  }
});

const User = new mongoose.Schema({
  username: {
    type: mongoose.SchemaTypes.String,
    require: true,
  },
  password: {
    type: mongoose.SchemaTypes.String,
    require: true,
  },
  fullname: {
    type: mongoose.SchemaTypes.String,
    require: true,
  },
  role: {
    type: mongoose.SchemaTypes.String,
    require: true,
  },
  attribute: [AttributeSchema],
});
module.exports = mongoose.model("User", User);
