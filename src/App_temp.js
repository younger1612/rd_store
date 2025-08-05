import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import OrderSummaryPage from './pages/OrderSummaryPage';
import InventoryOrderPage from './pages/InventoryOrderPage';
import PurchasePage from './pages/PurchasePage';
import Layout from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/dashboard/orders" replace />} />
            <Route
              path="/dashboard/orders"
              element={
                <ProtectedRoute>
                  <Layout>
                    <OrderSummaryPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory/order"
              element={
                <ProtectedRoute>
                  <Layout>
                    <InventoryOrderPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/purchases/monthly"
              element={
                <ProtectedRoute>
                  <Layout>
                    <PurchasePage />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
