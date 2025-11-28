import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/PostDetail.css";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export default function PostDetail() {
  const { id } = useParams();          // postId from URL
  const location = useLocation();      // post passed via navigate state
  const [post, setPost] = useState(location.state || null);
  const [replies, setReplies] = useState([]);
  const [replyContent, setReplyContent] = useState("");

  // Replace with logged-in userId from your auth context
  const uuss = sessionStorage.getItem("userdata");
  const parsedData = JSON.parse(uuss);
  const userId = parsedData["name"]; // temporary

  // Fetch post if not passed in state
  useEffect(() => {
    if (!post) {
      fetch(`http://127.0.0.1:8000/forum/${id}`)
        .then(res => res.json())
        .then(data => setPost(data))
        .catch(err => console.error("Error fetching post:", err));
    }
  }, [id, post]);

  // Fetch replies
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/forum/${id}/replies`)
      .then(res => res.json())
      .then(data => setReplies(data))
      .catch(err => console.error("Error fetching replies:", err));
  }, [id]);

  // Submit a reply
  const handleReplySubmit = async (e) => {
    e.preventDefault();
    const newReply = { content: replyContent, userId };

    try {
      const res = await fetch(`http://127.0.0.1:8000/forum/${id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReply),
      });
      const data = await res.json();
      setReplies([...replies, data]);   // update UI
      setReplyContent("");
    } catch (err) {
      console.error("Error posting reply:", err);
    }
  };

  if (!post) return <p className="text-center mt-4">Loading post...</p>;

  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="mb-3">{post.title}</h2>
          <p>{post.content}</p>
          <p><strong>Posted by:</strong> {post.userId}</p>
          <small className="text-muted">{dayjs(post.created_at).local().format("MMM D, YYYY h:mm A")}</small>

          <hr />

          <h4 className="mt-4">Replies</h4>
          {replies.length === 0 ? (
            <p className="text-muted">No replies yet. Be the first to comment!</p>
          ) : (
            <div className="list-group mb-3">
              {replies.map((reply) => (
                <div key={reply.id} className="list-group-item reply-card">
                  <p className="text-muted"><strong> {reply.userId}</strong>: {reply.content}</p>
                  <small className="text-muted">{dayjs(reply.created_at).local().format("MMM D, YYYY h:mm A")}</small>
                </div>
              ))}
            </div>
          )}

          {/* Reply Form */}
          <form className="reply-form" onSubmit={handleReplySubmit}>
            <div className="mb-3">
              <textarea
                className="form-control"
                rows="3"
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-success">Reply</button>
          </form>
        </div>
      </div>
    </div>
  );
}
