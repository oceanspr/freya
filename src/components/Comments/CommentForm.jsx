import React, { useState } from "react";
import { moderateComment } from "../../utils/moderation";

export default function CommentForm() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!moderateComment(comment)) {
      setStatus("Your comment contains blocked words.");
      return;
    }

    // Netlify Forms submission
    const formData = new FormData();
    formData.append("name", name);
    formData.append("city", city);
    formData.append("comment", comment);

    fetch("/", {
      method: "POST",
      body: formData,
    })
      .then(() => setStatus("Comment submitted successfully!"))
      .catch(() => setStatus("Error submitting comment."));
  };

  return (
    <form
      name="comments"
      method="POST"
      data-netlify="true"
      style={{ marginTop: "1rem" }}
    >
      <input type="hidden" name="form-name" value="comments" />
      <div>
        <label>First Name:</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>City:</label>
        <input
          type="text"
          name="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Comment:</label>
        <textarea
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </div>
      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
      {status && <p>{status}</p>}
    </form>
  );
}
