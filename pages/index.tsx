import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Home: React.FC = () => {
  const router = useRouter();
  const [comment, setComment] = useState('');
  const [showPostForm, setShowPostForm] = useState(false);
  const [comments, setComments] = useState<
    Array<{
      id: number;
      text: string;
      createdAt: string;
      likes: number;
      replies?: Array<any>;
    }>
  >([]);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  useEffect(() => {
    const avatar = localStorage.getItem('userAvatar');
    if (avatar) {
      setUserAvatar(avatar);
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch('/api/comments');
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(`/api/comments?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchComments(); // Refresh the comments list
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleLike = async (id: number, unlike: boolean) => {
    try {
      const response = await fetch(`/api/comments?action=like`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, unlike }),
      });

      if (response.ok) {
        localStorage.setItem(`liked_${id}`, (!unlike).toString());
        fetchComments(); // Refresh the comments list
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: comment,
          userEmail: localStorage.getItem('userEmail'),
        }),
      });

      if (response.ok) {
        setComment('');
        alert('Comment posted successfully!');
        fetchComments(); // Refresh comments after posting
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <div style={{ 
      maxWidth: '600px',
      margin: '0 auto',
      minHeight: '100vh',
      borderLeft: '1px solid var(--border-color)',
      borderRight: '1px solid var(--border-color)'
    }}>
      <div
        onClick={() => router.push('/trending')}
        className="hover-effect"
        style={{
          position: 'fixed',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '200px',
          padding: '15px',
          backgroundColor: 'var(--twitter-blue)',
          color: 'white',
          textAlign: 'center',
          cursor: 'pointer',
          borderRadius: '9999px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontWeight: 'bold',
          transition: 'background-color 0.2s',
        }}
      >
        🔥 Trending
      </div>

      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          cursor: 'pointer',
        }}
        onClick={() => (window.location.href = '/login')}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#1a8cd8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '20px',
          }}
        >
          {userAvatar ? (
            <img
              src={userAvatar}
              alt="User"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
              }}
            />
          ) : (
            '👤'
          )}
        </div>
      </div>

      <header style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        zIndex: 1000
      }}>
        <h1 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          margin: 0
        }}>
          Feedbacker
        </h1>
      </header>

      <div
        style={{
          width: '100%',
          position: 'relative',
          height: 'calc(100vh - 60px)',
          paddingBottom: '80px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflowY: 'auto',
            paddingRight: '20px',
            marginRight: '-20px',
            scrollbarWidth: 'thin',
            scrollbarColor: '#333 transparent',
          }}
        >
          <div style={{ direction: 'ltr', paddingRight: '8px' }}>
            {/* Display comments */}
            {comments.map((comment) => (
              <div
                key={comment.id}
                onClick={() => router.push(`/comment/${comment.id}`)}
                className="hover-effect"
                style={{
                  padding: '15px',
                  display: 'flex',
                  gap: '12px',
                  borderBottom: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{ 
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#1a8cd8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '20px',
                  flexShrink: 0
                }}>
                  👤
                </div>
                <div style={{ width: '100%' }}>
                  <p style={{ margin: '0 0 10px 0' }}>{comment.text}</p>
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '12px',
                  color: '#666'
                }}>
                  <span>{new Date(comment.createdAt).toLocaleString()}</span>
                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const isLiked = localStorage.getItem(`liked_${comment.id}`) === 'true';
                        handleLike(comment.id, isLiked);
                      }}
                      className="hover-effect"
                      style={{
                        padding: '5px 8px',
                        borderRadius: '9999px',
                        color: localStorage.getItem(`liked_${comment.id}`) === 'true' ? '#ff4b4b' : 'var(--secondary-text)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {localStorage.getItem(`liked_${comment.id}`) === 'true' ? '❤️' : '🖤'} {comment.likes}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(comment.id);
                      }}
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                </div>
              </div>
            ))}
            
            {!showPostForm ? (
              <button
                onClick={() => setShowPostForm(true)}
                style={{
                  position: 'fixed',
                  bottom: '20px',
                  left: '20px',
                  width: '50px',
                  height: '50px',
                  backgroundColor: '#1a8cd8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                +
              </button>
            ) : (
              <div
                style={{
                  position: 'fixed',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'white',
                  padding: '16px',
                  borderTop: '1px solid var(--border-color)',
                  zIndex: 1000,
                  width: '600px',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <button
                  onClick={() => setShowPostForm(false)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '10px',
                    border: 'none',
                    background: 'none',
                    fontSize: '18px',
                    cursor: 'pointer',
                    padding: '5px',
                  }}
                >
                  ✕
                </button>
                <form onSubmit={handleSubmit}>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your comment here..."
                    style={{
                      width: '100%',
                      height: '80px',
                      margin: '10px 0',
                      padding: '12px',
                      borderRadius: '16px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: '#fff',
                      color: 'var(--text-color)',
                      fontSize: '16px',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '8px 24px',
                      backgroundColor: 'var(--twitter-blue)',
                      color: 'white',
                      borderRadius: '9999px',
                      fontWeight: 'bold',
                      fontSize: '15px',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    Post Comment
                  </button>
                </form>
              </div>
            )}
            {/* Rest of your comments rendering */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
