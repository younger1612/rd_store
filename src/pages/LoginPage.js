import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 模擬 API 登入 - 實際應用中應該呼叫真實的 API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模擬登入驗證
      if (username === 'admin' && password === 'admin123') {
        const userData = { username: 'admin', role: 'admin' };
        const token = 'mock-jwt-token-admin';
        login(userData, token);
        navigate('/dashboard/orders');
      } else if (username === 'clerk' && password === 'clerk123') {
        const userData = { username: 'clerk', role: 'clerk' };
        const token = 'mock-jwt-token-clerk';
        login(userData, token);
        navigate('/dashboard/orders');
      } else {
        setError('用戶名或密碼錯誤');
      }
    } catch (err) {
      setError('登入失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>🧰 Rd Store</h1>
          <p>管理系統登入</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">用戶名</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="請輸入用戶名"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">密碼</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="請輸入密碼"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={loading} className="login-btn">
            {loading ? '登入中...' : '登入'}
          </button>
        </form>
        
        <div className="demo-accounts">
          <h3>測試帳號</h3>
          <div className="demo-account">
            <strong>管理員：</strong> admin / admin123
          </div>
          <div className="demo-account">
            <strong>店員：</strong> clerk / clerk123
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
