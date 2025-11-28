import { useState } from 'react';
//react
import { useLocation } from 'react-router-dom';
//useParams
import './css/CommunityForum.css';

export default function ForumDetail() {
  //const { id } = useParams();
  const location = useLocation();
  const post = location.state; // post object passed from forum list

  const [replies, setReplies] = useState([
    { id: 1, author: 'RestWell', text: 'Try a body pillow and avoid caffeine.', parentId: null },
    { id: 2, author: 'ZenMama', text: 'Meditation before bed helped me.', parentId: null },
    { id: 3, author: 'SleepyMom', text: 'I agree with RestWell!', parentId: 1 },
  ]);

  const [newReply, setNewReply] = useState('');
  const [replyTo, setReplyTo] = useState(null);

  const handleAddReply = (e) => {
    e.preventDefault();
    if (!newReply.trim()) return;
    const reply = {
      id: Date.now(),
      author: 'You',
      text: newReply,
      parentId: replyTo,
    };
    setReplies([...replies, reply]);
    setNewReply('');
    setReplyTo(null);
  };

  // Recursive rendering of replies with nesting
  const renderReplies = (parentId = null, level = 0) => {
    return replies
      .filter((r) => r.parentId === parentId)
      .map((reply) => (
        <div key={reply.id} className="reply" style={{ marginLeft: level * 20 }}>
          <strong>{reply.author}:</strong> {reply.text}
          <button
            className="small-reply-button"
            onClick={() => setReplyTo(reply.id)}
          >
            Reply
          </button>
          {renderReplies(reply.id, level + 1)}
        </div>
      ));
  };

  return (
    <div className="forum-page">
      <div className="forum-box">
        {/* Same header as card */}
        <h2>{post?.title}</h2>
        <p className="forum-author">Posted by {post?.author}</p>
        <p>{post?.content}</p>

        <div className="replies-scroll">
          {renderReplies()}
        </div>

        <form onSubmit={handleAddReply} className="reply-form">
          {replyTo && (
            <p className="replying-to">Replying to comment #{replyTo}</p>
          )}
          <input
            type="text"
            placeholder="Write a reply..."
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
          />
          <button type="submit">Post Reply</button>
        </form>
      </div>
    </div>
  );
}
