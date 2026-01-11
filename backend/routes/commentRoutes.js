/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Add comment
 *     tags: [Comments]
 */

import { Router } from "express";
import Comment from "../models/CommentSchema.js";
import Issue from "../models/IssueSchema.js";
import Project from "../models/ProjectSchema.js";
import auth from "../middlewares/authMiddleware.js";

const commentRoutes = Router();
 
/* ---------------- ADD COMMENT ---------------- */
commentRoutes.post("/", auth, async (req, res, next) => {
  try {
    const { text, issueId } = req.body;

    if (!text || !issueId)
      return res.status(400).json({ message: "Text and issueId required" });

    const issue = await Issue.findById(issueId);
    if (!issue)
      return res.status(404).json({ message: "Issue not found" });

    const project = await Project.findById(issue.projectId);
    if (!project.members.includes(req.user._id)) {
      return res.status(403).json({ message: "Not a project member" });
    }

    const comment = await Comment.create({
      text,
      issueId,
      userId: req.user._id,
    });

    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
});

/* ---------------- GET COMMENTS BY ISSUE ---------------- */
commentRoutes.get(
  "/issue/:issueId",
  auth,
  async (req, res, next) => {
    try {
      const comments = await Comment.find({
        issueId: req.params.issueId,
      }).populate("userId", "name");

      res.json(comments);
    } catch (err) {
      next(err);
    }
  }
);

/* ---------------- DELETE COMMENT ---------------- */
commentRoutes.delete("/:commentId", auth, async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment)
      return res.status(404).json({ message: "Comment not found" });

    if (
      comment.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    next(err);
  }
});

export default commentRoutes;
