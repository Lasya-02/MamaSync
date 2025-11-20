import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/CommunityForum.css';

export default function CommunityForum() {
  const navigate = useNavigate();

  const posts = [
    { id: 1, title: 'Sleep during pregnancy', author: 'User123', content: 'Struggling with sleep lately.' },
    { id: 2, title: 'Best meals for energy boost', author: 'MamaBee', content: 'Looking for quick energizing meals.' },
    { id: 3, title: 'Working while pregnant', author: 'WorkMom', content: 'Balancing work and pregnancy is tough.' },
  ];

  return (
    <div className="forum-page">
      <div className="forum-box">
        <h2 className="text-center mb-4">Community Forum</h2>
        <div className="forum-scroll">
          {posts.map((post) => (
            <div
              key={post.id}
              className="forum-card"
              onClick={() => navigate(`/forum/${post.id}`, { state: post })}
            >
              <h3>{post.title}</h3>
              <p className="forum-author">Posted by {post.author}</p>
              <p>{post.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
