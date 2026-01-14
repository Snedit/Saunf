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

    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null, // null = top-level comment
    },
  },
  { timestamps: true }
);

export default model("Comment", commentSchema);
