// pages/MyWork.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function MyWork() {
  const { projectId } = useParams();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyWork = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/projects/${projectId}/mywork`,
          {
            // /:projectId/mywork
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setIssues(res.data.issues);
      } catch (err) {
        console.error(err);
        alert("Failed to load your work. Backend is judging you.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyWork();
  }, [projectId]);

  if (loading) return <p>Loading your suffering…</p>;

  return (
    <div style={{ padding: "24px" }}>
      <h2>My Work</h2>

      {issues.length === 0 ? (
        <p>No issues assigned. Either lucky or unemployed.</p>
      ) : (
        <table width="100%" cellPadding="10">
          <thead>
            <tr>
              <th align="left">Key</th>
              <th align="left">Title</th>
              <th>Status</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue._id}>
                <td>{issue.key}</td>
                <td>{issue.title}</td>
                <td>{issue.status}</td>
                <td>{issue.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
