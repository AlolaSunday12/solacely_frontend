import React, { useEffect, useState } from 'react';
import api from '../api';

const COMMENTS_PER_PAGE = 5;

const Comment = () => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [showReplyForm, setShowReplyForm] = useState({});
  const [showAllReplies, setShowAllReplies] = useState({});

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/comment/allComment');
      setComments(res.data);
    } catch (err) {
      setError('Failed to fetch comments.');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const res = await api.post('/comment/create', { content: text });
      setComments([res.data, ...comments]);
      setText('');
    } catch (err) {
      setError('Failed to add comment.');
    }
  };

  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    if (!replyText[commentId]?.trim()) return;
    try {
      const res = await api.post(`/comment/${commentId}/replies`, {
        content: replyText[commentId],
      });

      const updatedComments = comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [res.data, ...(comment.replies || [])],
          };
        }
        return comment;
      });

      setComments(updatedComments);
      setReplyText((prev) => ({ ...prev, [commentId]: '' }));
      setShowReplyForm((prev) => ({ ...prev, [commentId]: false }));
      setShowAllReplies((prev) => ({ ...prev, [commentId]: true }));
    } catch (err) {
      setError('Failed to add reply.');
    }
  };

  const paginatedComments = comments.slice(
    (currentPage - 1) * COMMENTS_PER_PAGE,
    currentPage * COMMENTS_PER_PAGE
  );

  const totalPages = Math.ceil(comments.length / COMMENTS_PER_PAGE);

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 border-t pt-6">
      <h2 className="text-lg font-semibold mb-4 text-center">Community Comments</h2>

      <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 px-3 py-2 border rounded-md shadow-sm"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Post
        </button>
      </form>

      {loading ? (
        <p className="text-center text-gray-500">Loading comments...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          {paginatedComments.length === 0 ? (
            <p className="text-center text-gray-500">No comments yet.</p>
          ) : (
            <ul className="space-y-4">
              {paginatedComments.map((comment) => (
                <li key={comment.id} className="bg-gray-100 p-3 rounded-md shadow-sm text-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 mb-1">
                      {comment.User?.thumbnail && (
                        <img
                          src={comment.User.thumbnail}
                          alt="user"
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      )}
                      <span className="font-semibold">{comment.User?.username || 'Anonymous'}</span>
                    </div>
                    <button
                      onClick={() =>
                        setShowReplyForm((prev) => ({
                          ...prev,
                          [comment.id]: !prev[comment.id],
                        }))
                      }
                      className="text-blue-500 text-xs"
                    >
                      {showReplyForm[comment.id] ? 'Cancel' : 'Reply'}
                    </button>
                  </div>

                  <p className="ml-8">{comment.content}</p>

                  {showReplyForm[comment.id] && (
                    <form
                      onSubmit={(e) => handleReplySubmit(e, comment.id)}
                      className="mt-2 flex gap-2"
                    >
                      <input
                        type="text"
                        value={replyText[comment.id] || ''}
                        onChange={(e) =>
                          setReplyText((prev) => ({
                            ...prev,
                            [comment.id]: e.target.value,
                          }))
                        }
                        placeholder="Write a reply..."
                        className="flex-1 px-3 py-2 border rounded-md shadow-sm text-xs"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs"
                      >
                        Reply
                      </button>
                    </form>
                  )}

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3 pl-4 border-l border-gray-300">
                      <ul className="space-y-2">
                        {(showAllReplies[comment.id]
                          ? comment.replies
                          : comment.replies.slice(0, 1)
                        ).map((reply) => (
                          <li
                            key={reply.id}
                            className="bg-white p-2 rounded shadow-sm text-xs text-gray-700"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {reply.User?.thumbnail && (
                                <img
                                  src={reply.User.thumbnail}
                                  alt="user"
                                  className="w-5 h-5 rounded-full object-cover"
                                />
                              )}
                              <span className="font-medium text-xs">
                                {reply.User?.username || 'Anonymous'}
                              </span>
                            </div>
                            <p className="ml-7">{reply.content}</p>
                          </li>
                        ))}
                      </ul>

                      {comment.replies.length > 1 && (
                        <button
                          onClick={() =>
                            setShowAllReplies((prev) => ({
                              ...prev,
                              [comment.id]: !prev[comment.id],
                            }))
                          }
                          className="text-blue-500 text-xs mt-1 ml-1"
                        >
                          {showAllReplies[comment.id]
                            ? 'Hide replies'
                            : `View ${comment.replies.length - 1} more repl${
                                comment.replies.length - 1 > 1 ? 'ies' : 'y'
                              }`}
                        </button>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-md text-sm border ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Comment;

