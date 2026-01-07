/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get user projects
 *     tags: [Projects]
 */

import { Router } from "express";

import Project from "../models/ProjectSchema.js";
import auth from "../middlewares/authMiddleware.js";
import allowRoles from "../middlewares/roleMiddleware.js";
import projectAccess from "../middlewares/projectAccessMiddleware.js";
import User from "../models/UserSchema.js";
import rateLimit from "../middlewares/RateLimitter.js";
import projectOwnerOnly from "../middlewares/projectOwnerOnly.js"
import Issue from "../models/IssueSchema.js";
const projectRoutes = Router();
projectRoutes.use(rateLimit);

// add members
projectRoutes.post(
  "/:projectId/members",
  auth,
  projectOwnerOnly,
  async (req, res, next) => {
    try {
      const { email } = req.body;

      if (!email)
        return res.status(400).json({ message: "Email is required" });

      //  Find user by email
      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "User not found" });

      //  Prevent self-add (optional but clean)
      if (user._id.toString() === req.user._id.toString())
        return res.status(400).json({ message: "You are already the owner" });

      // Check if already member
      const alreadyMember = req.project.members.some(
        (id) => id.toString() === user._id.toString()
      );

      if (alreadyMember)
        return res.status(400).json({ message: "User already a member" });

      // 4️⃣ Add member
      req.project.members.push(user._id);
      await req.project.save();

      res.status(200).json({
        message: "Member added successfully",
        member: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

projectRoutes.get('/:projectId/members', auth, projectAccess, async (req, res) => {
  try {
    const project = await req.project.populate({
      path: "members",
      select: "name email"
    });

    return res.status(200).json({
      members: project.members,
      message: "Members fetched!"
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Error fetching members!" });
  }
});


// only admins can create new project
projectRoutes.post(
  "/",
  auth,
  async (req, res, next) => {
    try {
      const { name, key, description } = req.body;

      if (!name || !key)
        return res.status(400).json({ message: "Name and key required" });

      const project = await Project.create({
        name,
        key,
        description,
        createdBy: req.user._id,
        members: [req.user._id],
      });

      res.status(201).json(project);
    } catch (err) {
      next(err);
    }
  }
);

/* ---------------- GET USER PROJECTS ---------------- */
projectRoutes.get("/", auth, async (req, res, next) => {
  try {
    const projects = await Project.aggregate([
      {
        $match: {
          members: req.user._id,
        },
      },
      {
        $lookup: {
          from: "issues",              // Mongo auto-plural
          localField: "_id",
          foreignField: "projectId",   // IMPORTANT
          as: "issues",
        },
      },
      {
        $addFields: {
          issueCount: { $size: "$issues" },
        },
      },
      {
        $project: {
          issues: 0, // drop heavy array
        },
      },
    ]);

    res.json(projects);
  } catch (err) {
    next(err);
  }
});



/* ---------------- GET PROJECT BY ID ---------------- */
projectRoutes.get(
  "/:projectId",
  auth,
  projectAccess,
  async (req, res) => {
    res.json(req.project);
  }
);

/* ---------------- UPDATE PROJECT ---------------- */
projectRoutes.put(
  "/:projectId",
  auth,
  projectAccess,
  async (req, res, next) => {
    try {
      const { name, description } = req.body;

      if (name) req.project.name = name;
      if (description) req.project.description = description;

      await req.project.save();
      res.json(req.project);
    } catch (err) {
      next(err);
    }
  }
);

/* ---------------- DELETE PROJECT ---------------- */
projectRoutes.delete(
  "/:projectId",
  auth,
  allowRoles("admin"),
  projectAccess,
  async (req, res, next) => {
    try {
      await req.project.deleteOne();
      res.json({ message: "Project deleted" });
    } catch (err) {
      next(err);
    }
  }
);

// add member
projectRoutes.post(
  "/:projectId/members",
  auth,
  projectAccess,
  allowRoles('admin'),
  async (req, res, next) => {
    try {
      const { userId } = req.body;

      const user = await User.findById(userId);
      if (!user)
        return res.status(404).json({ message: "User not found" });

      if (req.project.members.includes(userId)) {
        return res.status(400).json({ message: "User already a member" });
      }

      req.project.members.push(userId);
      await req.project.save();

      res.json(req.project);
    } catch (err) {
      next(err);
    }
  }
);

/* ---------------- REMOVE MEMBER ---------------- */
projectRoutes.delete(
  "/:projectId/members/:userId",
  auth,
  projectAccess,
  allowRoles('admin'),
  async (req, res, next) => {
    try {
      const { userId } = req.params;

      if (req.project.createdBy.toString() === userId) {
        return res
          .status(400)
          .json({ message: "Cannot remove project creator" });
      }

      req.project.members = req.project.members.filter(
        (id) => id.toString() !== userId
      );

      await req.project.save();
      res.json(req.project);
    } catch (err) {
      next(err);
    }
  }
);
projectRoutes.get(
  "/:projectId/mywork",
  auth,
  projectAccess, // ensures user is a project member
  async (req, res, next) => {
    try {
      const issues = await Issue.find({
        projectId: req.project._id,
        assignee: req.user._id,
      })
        .populate("assignee", "name email")
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });

      res.status(200).json({
        issues,
        count: issues.length,
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET PROJECT STATS
projectRoutes.get(
  "/:projectId/stats",
  auth,
  projectAccess,
  async (req, res, next) => {
    try {
      const projectId = req.project._id;
      const userId = req.user._id;

      const stats = await Issue.aggregate([
        {
          $match: {
            projectId,
          },
        },
        {
          $facet: {
            total: [{ $count: "count" }],

            byStatus: [
              {
                $group: {
                  _id: "$status",
                  count: { $sum: 1 },
                },
              },
            ],

            byPriority: [
              {
                $group: {
                  _id: "$priority",
                  count: { $sum: 1 },
                },
              },
            ],

            myWork: [
              {
                $match: {
                  assignee: userId,
                },
              },
              { $count: "count" },
            ],
          },
        },
      ]);

      const result = stats[0];

      res.json({
        totalIssues: result.total[0]?.count || 0,

        status: {
          todo: result.byStatus.find(s => s._id === "todo")?.count || 0,
          "in-progress":
            result.byStatus.find(s => s._id === "in-progress")?.count || 0,
          done: result.byStatus.find(s => s._id === "done")?.count || 0,
        },

        priority: {
          low: result.byPriority.find(p => p._id === "low")?.count || 0,
          medium: result.byPriority.find(p => p._id === "medium")?.count || 0,
          high: result.byPriority.find(p => p._id === "high")?.count || 0,
        },

        myWork: result.myWork[0]?.count || 0,
      });
    } catch (err) {
      next(err);
    }
  }
);



export default projectRoutes;
