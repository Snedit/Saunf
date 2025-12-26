/**
 * @swagger
 * /api/issues:
 *   post:
 *     summary: Create issue
 *     tags: [Issues]
 */


import { Router } from "express";
import auth from "../middlewares/authMiddleware.js";
import Issue from "../models/IssueSchema.js";
import projectAccess from "../middlewares/projectAccessMiddleware.js";
import issueAccess from "../middlewares/issueAccessMiddleware.js";
import allowRoles from "../middlewares/roleMiddleware.js";
import rateLimit from "../middlewares/RateLimitter.js";

const issueRoutes = Router();
issueRoutes.use(rateLimit);

issueRoutes.get('/', auth, async (req, res, next) =>{
  try {
      const userId  = req.user._id;

      const Issues  = Issue.find({createdBy: userId});

      return res.status(200).json({Issues});

  } catch (err) {
    next(err); 
  }
})

// create issue for a particular project;
issueRoutes.post("/:projectId", auth, projectAccess, async (req, res, next) => {
  try {
    const { title, description, type, priority,  status } = req.body;
    const projectId = req.params.projectId;
    const assignee = req.user._id;
    if (!title)
      return res.status(400).json({ message: "Title is required" });

    const issue = await Issue.create({
      title,
      description,
      type,
      priority,
      assignee,
      status: status || "todo",
      projectId,
      createdBy: req.user._id,
    });

    // 🔥 THIS IS THE IMPORTANT PART
    const populatedIssue = await issue.populate(
      "assignee",
      "name email"
    );

    res.status(201).json(populatedIssue);
  } catch (err) {
    next(err);
  }
});


issueRoutes.get(
  "/project/:projectId",
  auth,
  projectAccess,
  
  async (req, res, next) => {
    try {
      const issues = await Issue.find({
        projectId: req.params.projectId,
      }).populate("assignee", "name email");

      res.json(issues);
    } catch (err) {
      next(err);
    }
  }
);

issueRoutes.get("/:issueId", auth, issueAccess, async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.issueId)
      .populate("assignee", "name")
      .populate("createdBy", "name");

    if (!issue) return res.status(404).json({ message: "Issue not found" });

    res.json(issue);
  } catch (err) {
    next(err);
  }
});

 
issueRoutes.put("/:issueId", auth, issueAccess, async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.issueId);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    Object.assign(issue, req.body);
    await issue.save();

    res.json(issue);
  } catch (err) {
    next(err);
  }
});

 
issueRoutes.patch("/:issueId/status", auth, issueAccess, async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["todo", "in-progress", "done"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const issue = await Issue.findById(req.params.issueId);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    issue.status = status;
    await issue.save();

    res.json(issue);
  } catch (err) {
    next(err);
  }
});

 
issueRoutes.delete("/:issueId", auth, allowRoles('admin'), issueAccess, async (req, res, next) => {
  try {
    const issue = req.issue;
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    await issue.deleteOne();
    res.json({ message: "Issue deleted" });
  } catch (err) {
    next(err);
  }
});

export default issueRoutes;
