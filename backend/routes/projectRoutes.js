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


const projectRoutes = Router();
projectRoutes.use(rateLimit);
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
    const projects = await Project.find({
      members: req.user._id,
    });

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


export default projectRoutes;
