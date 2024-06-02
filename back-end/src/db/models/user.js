import mongoose from "mongoose";

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
});
export default mongoose.model("User", User);
