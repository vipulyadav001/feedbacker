import React, { useState } from 'react';
import crypto from 'crypto';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual authentication
    if (email && password) {
      router.push('/');
    }
  };

  return (
    <div style={{ 
      maxWidth: '600px',
      margin: '0 auto',
      minHeight: '100vh',
      borderLeft: '1px solid var(--border-color)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '48px 32px'
    }}>
      <h1 style={{ 
        fontSize: '31px',
        marginBottom: '32px',
        fontWeight: 'bold'
      }}>Login to Feedbacker</h1>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '364px' }}>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{ 
              width: '100%',
              padding: '12px',
              borderRadius: '4px',
              border: '1px solid var(--border-color)',
              fontSize: '16px',
              backgroundColor: 'var(--background-color)'
            }}
          />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{ 
              width: '100%',
              padding: '12px',
              borderRadius: '4px',
              border: '1px solid var(--border-color)',
              fontSize: '16px',
              backgroundColor: 'var(--background-color)'
            }}
          />
        </div>
        <button 
          type="submit"
          style={{
            padding: '12px',
            backgroundColor: 'var(--twitter-blue)',
            color: 'white',
            border: 'none',
            borderRadius: '9999px',
            cursor: 'pointer',
            width: '100%',
            fontWeight: 'bold',
            fontSize: '15px'
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
