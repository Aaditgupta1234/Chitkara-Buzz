import React, { useState } from 'react';
import './StudentAuth.css';

function StudentLogin({ onLoginSuccess, onSwitchToRegister }) {
  const [loginMethod, setLoginMethod] = useState('rollNumber'); // 'rollNumber' or 'email'
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rollNumber: loginMethod === 'rollNumber' ? rollNumber : '',
          email: loginMethod === 'email' ? email : '',
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token and student data
      localStorage.setItem('studentToken', data.token);
      localStorage.setItem('studentData', JSON.stringify(data.student));

      onLoginSuccess(data.student);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-auth-container">
      <div className="student-auth-card">
        <div className="auth-header">
          <h2>Student Login</h2>
          <p>Access your Chitkara Buzz account</p>
        </div>

        <div className="login-method-toggle">
          <button
            type="button"
            className={`method-btn ${loginMethod === 'rollNumber' ? 'active' : ''}`}
            onClick={() => setLoginMethod('rollNumber')}
          >
            Roll Number
          </button>
          <button
            type="button"
            className={`method-btn ${loginMethod === 'email' ? 'active' : ''}`}
            onClick={() => setLoginMethod('email')}
          >
            Email
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {loginMethod === 'rollNumber' ? (
            <div className="form-group">
              <label htmlFor="rollNumber">Roll Number</label>
              <input
                type="text"
                id="rollNumber"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="Enter your roll number"
                required
              />
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-switch">
          <p>Don't have an account?</p>
          <button type="button" onClick={onSwitchToRegister} className="switch-btn">
            Register here
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;
