import { Schema, model } from "mongoose";

const commentSchema = new Schema(
  {
    text: { type: String, required: true },

    issueId: {
      type: Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = model("Comment", commentSchema);
export default Comment;
