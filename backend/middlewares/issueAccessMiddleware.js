import Issue from "../models/IssueSchema.js";
import Project from "../models/ProjectSchema.js";

const issueAccess = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.issueId);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Admin bypass
    if (req.user.role === "admin") {
      req.issue = issue;
      return next();
    }

    const userId = req.user._id.toString();

    // Creator or assignee
    if (
      issue.createdBy.toString() === userId ||
      issue.assignee.toString() === userId
    ) {
      req.issue = issue;
      return next();
    }

    // 🔥 Project membership check
    const project = await Project.findById(issue.projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isMember = project.members.some(
      (memberId) => memberId.toString() === userId
    );

    if (!isMember) {
      return res.status(403).json({ message: "Issue access denied" });
    }

    req.issue = issue;
    next();
  } catch (err) {
    next(err);
  }
};

export default issueAccess;
