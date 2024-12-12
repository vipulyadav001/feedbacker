import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface Comment {
  id: number;
  text: string;
  createdAt: string;
  likes: number;
  potentialRating: number;
  replies?: Array<any>;
}

export default function Trending() {
  const [comments, setComments] = useState<Comment[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch('/api/comments');
      if (response.ok) {
        const data = await response.json();
        // Sort by potential rating
        const sortedComments = data.sort((a: Comment, b: Comment) => 
          (b.potentialRating || 0) - (a.potentialRating || 0)
        );
        setComments(sortedComments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  return (
    <div style={{ 
      maxWidth: '600px',
      margin: '0 auto',
      minHeight: '100vh',
      borderLeft: '1px solid var(--border-color)',
      borderRight: '1px solid var(--border-color)',
      padding: '12px'
    }}>
      <header style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '32px'
      }}>
        <button 
          onClick={() => router.push('/')}
          className="hover-effect"
          style={{
            color: 'var(--text-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ← Back
        </button>
        <h1 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          margin: 0
        }}>
          Trending
        </h1>
      </header>
      
      <div>
        {comments.map((comment, index) => (
          <div 
            key={comment.id}
            onClick={() => router.push(`/comment/${comment.id}`)}
            className="hover-effect"
            style={{ 
              display: 'flex',
              alignItems: 'flex-start',
              cursor: 'pointer',
              padding: '16px',
              borderBottom: '1px solid var(--border-color)',
              transition: 'background-color 0.2s'
            }}
          >
            <div style={{ 
              marginRight: '12px', 
              fontSize: '20px', 
              fontWeight: 'bold',
              color: 'var(--twitter-blue)',
              minWidth: '32px'
            }}>
              #{index + 1}
            </div>
            <div style={{ flex: 1 }}>
              <p>{comment.text}</p>
              <div style={{ 
                marginTop: '5px',
                fontSize: '12px',
                color: '#666'
              }}>
                Potential Rating: {comment.potentialRating || 0}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
