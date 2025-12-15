import { Schema, model } from "mongoose";

const projectSchema = new Schema(
  {
    name: { type: String, required: true },

    key: {
      type: String,
      required: true,
      unique: true,
      uppercase: true, // PROJ, JIRA-style
      trim: true,
    },

    description: { type: String },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Project = model("Project", projectSchema);
export default Project;
