import mongoose from "mongoose";

const Author = new mongoose.Schema({
  name: {
    type: mongoose.SchemaTypes.String,
    require: true,
  },
});
export default mongoose.model("Author", Author);
