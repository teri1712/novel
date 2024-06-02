import mongoose from "mongoose";

const UserRead = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  chapter: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Chapter",
  },
  readAt: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.model("UserRead", UserRead);
