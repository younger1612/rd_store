import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import './OrderSummaryPage.css';

const OrderSummaryPage = () => {
  const [dateRange, setDateRange] = useState({
    from: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    to: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalCost: 0,
    netProfit: 0,
    orderCount: 0
  });
  const [loading, setLoading] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  // 模擬 API 數據
  const mockOrders = [
    {
      id: 'ORD-001',
      customer: '張先生',
      customerUrl: 'https://example.com/customer/zhang',
      amount: 25000,
      status: '完成',
      date: '2025-08-01',
      cost: 20000
    },
    {
      id: 'ORD-002',
      customer: '李小姐',
      customerUrl: 'https://example.com/customer/li',
      amount: 35000,
      status: '配送',
      date: '2025-08-02',
      cost: 28000
    },
    {
      id: 'ORD-003',
      customer: '王先生',
      customerUrl: 'https://example.com/customer/wang',
      amount: 18000,
      status: '出貨',
      date: '2025-08-03',
      cost: 15000
    },
    {
      id: 'ORD-004',
      customer: '陳太太',
      customerUrl: 'https://example.com/customer/chen',
      amount: 42000,
      status: '訂金',
      date: '2025-08-04',
      cost: 35000
    }
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // 模擬 API 調用
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 從localStorage獲取推送的訂單
        const pushedOrders = JSON.parse(localStorage.getItem('summaryOrders') || '[]');
        
        // 合併模擬數據和推送的訂單
        const allOrders = [...pushedOrders, ...mockOrders];
        
        // 過濾日期範圍內的訂單
        const filteredOrders = allOrders.filter(order => {
          return order.date >= dateRange.from && order.date <= dateRange.to;
        });
        
        setOrders(filteredOrders);
        
        // 計算統計數據
        const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.amount, 0);
        const totalCost = filteredOrders.reduce((sum, order) => sum + order.cost, 0);
        const netProfit = totalRevenue - totalCost;
        
        setSummary({
          totalRevenue,
          totalCost,
          netProfit,
          orderCount: filteredOrders.length
        });
      } catch (error) {
        console.error('獲取訂單數據失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [dateRange]);

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case '完成': return 'success';
      case '配送': return 'info';
      case '出貨': return 'warning';
      case '訂金': return 'secondary';
      default: return 'secondary';
    }
  };

  // 開始編輯訂單
  const startEdit = (order) => {
    setEditingOrder({ ...order });
  };

  // 取消編輯
  const cancelEdit = () => {
    setEditingOrder(null);
  };

  // 保存編輯
  const saveEdit = () => {
    // 更新本地狀態
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === editingOrder.id ? editingOrder : order
      )
    );
    
    // 檢查是否為推送的訂單（ID以ORD-開頭且有timestamp）
    const isPushedOrder = editingOrder.id.includes(Date.now().toString().slice(0, 8));
    
    if (isPushedOrder || editingOrder.items) {
      // 更新localStorage中的推送訂單
      const pushedOrders = JSON.parse(localStorage.getItem('summaryOrders') || '[]');
      const updatedPushedOrders = pushedOrders.map(order => 
        order.id === editingOrder.id ? editingOrder : order
      );
      localStorage.setItem('summaryOrders', JSON.stringify(updatedPushedOrders));
    }
    
    setEditingOrder(null);
    
    // 重新計算統計數據
    const updatedOrders = orders.map(order => 
      order.id === editingOrder.id ? editingOrder : order
    );
    
    const totalRevenue = updatedOrders.reduce((sum, order) => sum + order.amount, 0);
    const totalCost = updatedOrders.reduce((sum, order) => sum + order.cost, 0);
    const netProfit = totalRevenue - totalCost;
    
    setSummary({
      totalRevenue,
      totalCost,
      netProfit,
      orderCount: updatedOrders.length
    });

    alert('訂單修改已保存！');
  };

  // 更新編輯中的訂單
  const updateEditingOrder = (field, value) => {
    setEditingOrder(prev => ({
      ...prev,
      [field]: field === 'amount' || field === 'cost' ? Number(value) : value
    }));
  };

  // 清除推送的訂單
  const clearPushedOrders = () => {
    if (window.confirm('確定要清除所有推送的訂單嗎？這個操作無法復原。')) {
      localStorage.removeItem('summaryOrders');
      // 重新載入數據
      window.location.reload();
    }
  };

  return (
    <div className="order-summary-page">
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1>📊 訂單與利潤總覽</h1>
            <p>查看指定日期範圍內的訂單統計和財務摘要</p>
          </div>
          <div className="header-actions">
            <button 
              onClick={clearPushedOrders}
              className="clear-orders-btn"
              title="清除所有推送的訂單"
            >
              🗑️ 清除推送訂單
            </button>
          </div>
        </div>
      </div>

      <div className="date-filter">
        <div className="date-inputs">
          <div className="date-input-group">
            <label>起始日期</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => handleDateChange('from', e.target.value)}
            />
          </div>
          <div className="date-input-group">
            <label>結束日期</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => handleDateChange('to', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card revenue">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>總收入</h3>
            <div className="card-value">NT$ {summary.totalRevenue.toLocaleString()}</div>
          </div>
        </div>
        <div className="summary-card cost">
          <div className="card-icon">💸</div>
          <div className="card-content">
            <h3>總支出</h3>
            <div className="card-value">NT$ {summary.totalCost.toLocaleString()}</div>
          </div>
        </div>
        <div className="summary-card profit">
          <div className="card-icon">📈</div>
          <div className="card-content">
            <h3>淨利潤</h3>
            <div className="card-value">NT$ {summary.netProfit.toLocaleString()}</div>
          </div>
        </div>
        <div className="summary-card orders">
          <div className="card-icon">📋</div>
          <div className="card-content">
            <h3>訂單數量</h3>
            <div className="card-value">{summary.orderCount} 筆</div>
          </div>
        </div>
      </div>

      <div className="orders-table-container">
        <h2>訂單列表</h2>
        {loading ? (
          <div className="loading">載入中...</div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>訂單編號</th>
                <th>顧客</th>
                <th>金額</th>
                <th>成本</th>
                <th>利潤</th>
                <th>狀態</th>
                <th>日期</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td className="order-id">{order.id}</td>
                  <td className="customer-cell">
                    {editingOrder && editingOrder.id === order.id ? (
                      <div className="edit-customer-group">
                        <input
                          type="text"
                          value={editingOrder.customer}
                          onChange={(e) => updateEditingOrder('customer', e.target.value)}
                          className="edit-input"
                        />
                        <input
                          type="url"
                          value={editingOrder.customerUrl}
                          onChange={(e) => updateEditingOrder('customerUrl', e.target.value)}
                          placeholder="顧客連結"
                          className="edit-input url-input"
                        />
                      </div>
                    ) : (
                      <a 
                        href={order.customerUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="customer-link"
                      >
                        {order.customer}
                      </a>
                    )}
                  </td>
                  <td className="amount">
                    {editingOrder && editingOrder.id === order.id ? (
                      <input
                        type="number"
                        value={editingOrder.amount}
                        onChange={(e) => updateEditingOrder('amount', e.target.value)}
                        className="edit-input money-input"
                      />
                    ) : (
                      `NT$ ${order.amount.toLocaleString()}`
                    )}
                  </td>
                  <td className="cost">
                    {editingOrder && editingOrder.id === order.id ? (
                      <input
                        type="number"
                        value={editingOrder.cost}
                        onChange={(e) => updateEditingOrder('cost', e.target.value)}
                        className="edit-input money-input"
                      />
                    ) : (
                      `NT$ ${order.cost.toLocaleString()}`
                    )}
                  </td>
                  <td className="profit">
                    NT$ {editingOrder && editingOrder.id === order.id 
                      ? (editingOrder.amount - editingOrder.cost).toLocaleString()
                      : (order.amount - order.cost).toLocaleString()
                    }
                  </td>
                  <td className="status-cell">
                    {editingOrder && editingOrder.id === order.id ? (
                      <select
                        value={editingOrder.status}
                        onChange={(e) => updateEditingOrder('status', e.target.value)}
                        className="edit-select"
                      >
                        <option value="訂金">訂金</option>
                        <option value="出貨">出貨</option>
                        <option value="配送">配送</option>
                        <option value="完成">完成</option>
                      </select>
                    ) : (
                      <span className={`status ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    )}
                  </td>
                  <td className="date-cell">
                    {editingOrder && editingOrder.id === order.id ? (
                      <input
                        type="date"
                        value={editingOrder.date}
                        onChange={(e) => updateEditingOrder('date', e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      order.date
                    )}
                  </td>
                  <td className="actions-cell">
                    {editingOrder && editingOrder.id === order.id ? (
                      <div className="edit-actions">
                        <button onClick={saveEdit} className="save-btn">💾</button>
                        <button onClick={cancelEdit} className="cancel-btn">❌</button>
                      </div>
                    ) : (
                      <button onClick={() => startEdit(order)} className="edit-btn">✏️</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {!loading && orders.length === 0 && (
          <div className="no-data">
            <p>所選日期範圍內沒有訂單數據</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummaryPage;
