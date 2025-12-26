import Project from "../models/ProjectSchema.js";

const projectOwnerOnly = async (req, res, next) => {
  const project = await Project.findById(req.params.projectId);

  if (!project)
    return res.status(404).json({ message: "Project not found" });

  if (project.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Only project owner allowed" });
  }

  req.project = project;
  next();
};

export default projectOwnerOnly;