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
    const { text, issueId, parentComment = null } = req.body;

    if (!text || !issueId) {
      return res.status(400).json({ message: "Text and issueId required" });
    }

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const project = await Project.findById(issue.projectId);
    if (!project.members.includes(req.user._id)) {
      return res.status(403).json({ message: "Not a project member" });
    }

    // If this is a reply, validate parent comment
    if (parentComment) {
      const parent = await Comment.findById(parentComment);
      if (!parent || parent.issueId.toString() !== issueId) {
        return res.status(400).json({ message: "Invalid parent comment" });
      }
    }

    const comment = await Comment.create({
      text,
      issueId,
      parentComment,
      userId: req.user._id,
    });

    return res.status(201).json({
      _id: comment._id,
      text: comment.text,
      issueId: comment.issueId,
      parentComment: comment.parentComment,
      user: {
        _id: req.user._id,
        name: req.user.name,
      },
      createdAt: comment.createdAt,
    });
  } catch (err) {
    next(err);
  }
});

/* ---------------- GET COMMENTS BY ISSUE ---------------- */
commentRoutes.get("/issue/:issueId", auth, async (req, res, next) => {
  try {
    const comments = await Comment.find({
      issueId: req.params.issueId,
    })
      .sort({ createdAt: 1 })
      .populate("userId", "name");

    res.json(
      comments.map((c) => ({
        _id: c._id,
        text: c.text,
        issueId: c.issueId,
        parentComment: c.parentComment,
        user: {
          _id: c.userId._id,
          name: c.userId.name,
        },
        createdAt: c.createdAt,
      }))
    );
  } catch (err) {
    next(err);
  }
});


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
