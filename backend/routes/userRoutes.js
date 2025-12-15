import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/UserSchema.js";
import auth from "../middlewares/authMiddleware.js";
import allowRoles from "../middlewares/roleMiddleware.js";

const userRoutes = Router();

/* ---------------- GET OWN PROFILE ---------------- */
userRoutes.get("/me", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    next(err);
  }
});

/* ---------------- UPDATE OWN PROFILE ---------------- */
userRoutes.patch("/me", auth, async (req, res, next) => {
  try {
    const { name, password } = req.body;

    if (name) req.user.name = name;

    if (password) {
      req.user.password = await bcrypt.hash(password, 10);
    }

    await req.user.save();

    res.json({
      message: "Profile updated",
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (err) {
    next(err);
  }
});

/* ---------------- GET ALL USERS (ADMIN) ---------------- */
userRoutes.get("/", auth, allowRoles("admin"), async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    next(err);
  }
});

/* ---------------- UPDATE USER ROLE (ADMIN) ---------------- */
userRoutes.patch(
  "/:userId/role",
  auth,
  allowRoles("admin"),
  async (req, res, next) => {
    try {
      const { role } = req.body;

      if (!["admin", "user"].includes(role))
        return res.status(400).json({ message: "Invalid role" });

      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { role },
        { new: true }
      ).select("-password");

      if (!user)
        return res.status(404).json({ message: "User not found" });

      res.json(user);
    } catch (err) {
      next(err);
    }
  }
);

export default userRoutes;
