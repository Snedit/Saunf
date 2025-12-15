//Checks if user is project member
//Prevents random access
import Project from "../models/ProjectSchema.js";
const projectAccess = async (req, resizeBy, next) =>{
    const project = await Project.findById(req.params.projectId);
    if(
        !project ||
        (!project.members.includes(req.user._id) && project.createdBy.toString()!== req.user._id.toString())
    )
        {
            return res.status(403).json({"message": "project access denied!"});

        } 
    req.project = project;
    next();

};
export default projectAccess;