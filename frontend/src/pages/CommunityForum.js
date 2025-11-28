import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/CommunityForum.css";

export default function CommunityForum() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Replace with logged-in userId from your auth context
  const uuss = sessionStorage.getItem("userdata");
  const parsedData = JSON.parse(uuss);
  const userId = parsedData["name"]; // temporary

  useEffect(() => {
    fetch("http://127.0.0.1:8000/forum")
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = { title, content, userId };

    try {
      const res = await fetch("http://127.0.0.1:8000/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });
      const data = await res.json();
      setPosts([...posts, data]);
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="text-center mb-4">Community Forum</h2>

          {/* New Post Form */}
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <textarea
                className="form-control"
                rows="3"
                placeholder="Write your post..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Post
            </button>
          </form>

          {/* Posts List */}
          <div className="list-group">
            {posts.map((post) => (
              <button
                key={post._id}
                className="list-group-item list-group-item-action mb-2 forum-card"
                onClick={() => navigate(`/forum/${post._id}`, { state: post })}
              >
                <h5 className="mb-1">{post.title}</h5>
                <small className="text-muted">Posted by {post.userId}</small>
                <p className="mb-1">{post.content}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
