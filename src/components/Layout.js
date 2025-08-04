import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = [
    {
      path: '/dashboard/orders',
      label: '訂單總覽',
      icon: '📊'
    },
    {
      path: '/inventory/order',
      label: '庫存下單',
      icon: '📦'
    },
    {
      path: '/purchases/monthly',
      label: '進貨管理',
      icon: '📋'
    }
  ];

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="header-content">
          <h1 className="header-title">🧰 Rd Store 管理系統</h1>
          <div className="header-user">
            <span className="user-info">
              {user?.username} ({user?.role === 'admin' ? '管理員' : '店員'})
            </span>
            <button onClick={handleLogout} className="logout-btn">
              登出
            </button>
          </div>
        </div>
      </header>

      <div className="layout-body">
        <nav className="layout-sidebar">
          <ul className="nav-list">
            {navigationItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <main className="layout-main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
