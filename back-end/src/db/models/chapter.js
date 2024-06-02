import mongoose from "mongoose";

const Chapter = new mongoose.Schema({
  number: {
    type: mongoose.SchemaTypes.Number,
    require: true,
  },
  title: {
    type: mongoose.SchemaTypes.String,
    require: true,
  },
  novel: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Novel",
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
});
export default mongoose.model("Chapter", Chapter);
