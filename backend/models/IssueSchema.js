import mongoose, { Schema } from "mongoose";
const issueSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ["bug", "task", "story"], default: "task" },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "low",
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timeStamps: true,
  }
);

const Issue = mongoose.model("Issue", issueSchema);

export default Issue;