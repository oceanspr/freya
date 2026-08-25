import React, { useEffect, useState } from "react";

export default function CommentList() {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await fetch(
          "https://api.netlify.com/api/v1/forms/YOUR_FORM_ID/submissions",
          {
            headers: {
              Authorization: "Bearer YOUR_NETLIFY_ACCESS_TOKEN",
            },
          }
        );
        const data = await response.json();

        // Map Netlify submissions into our comment format
        const formatted = data.map((submission) => ({
          name: submission.data.name,
          city: submission.data.city,
          comment: submission.data.comment,
        }));

        setComments(formatted);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }

    fetchComments();
  }, []);

  return (
    <div style={{ marginTop: "1rem" }}>
      {comments.length === 0 ? (
        <p>No comments yet. Be the first to contribute!</p>
      ) : (
        comments.map((c, index) => (
          <div
            key={index}
            style={{ borderBottom: "1px solid #ccc", padding: "0.5rem 0" }}
          >
            <strong>
              {c.name} ({c.city})
            </strong>
            <p>{c.comment}</p>
          </div>
        ))
      )}
    </div>
  );
}
