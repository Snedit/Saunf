import Issue from '../models/IssueSchema.js';

const issueAccess = async (req, res , next)=>{


    const issue  = await Issue.findById(req.params.issueId);
    if(!issue ||
        (issue.assignee.toString() !== req.user._id.toString()
        && issue.createdBy.toString() !== req.user._id.toString()
        && req.user.role !== 'admin')
        )
    {
        return res.status(403).json({message  : "Issue access denied!"});

    }
    req.issue = issue;
    next();
    
}
export default issueAccess;
