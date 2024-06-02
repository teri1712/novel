import mongoose from "mongoose";

const Supplier = new mongoose.Schema({
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
export default mongoose.model("Supplier", Supplier);
