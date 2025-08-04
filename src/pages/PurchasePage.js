import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import './PurchasePage.css';

const PurchasePage = () => {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newPurchase, setNewPurchase] = useState({
    productId: '',
    customProductName: '',
    isCustomProduct: false,
    quantity: '',
    unitCost: '',
    purchaseDate: format(new Date(), 'yyyy-MM-dd'),
    supplier: '',
    notes: ''
  });

  // 模擬產品數據
  const mockProducts = [
    { id: 1, name: 'Intel Core i7-13700K', category: 'CPU' },
    { id: 2, name: 'NVIDIA RTX 4070', category: 'GPU' },
    { id: 3, name: 'ASUS ROG B650E-F', category: 'Motherboard' },
    { id: 4, name: 'Corsair DDR5-5600 16GB', category: 'RAM' },
    { id: 5, name: 'Samsung 980 PRO 1TB', category: 'Storage' },
    { id: 6, name: 'Corsair RM850x', category: 'PSU' }
  ];

  // 模擬進貨數據
  const mockPurchases = [
    {
      id: 1,
      productId: 1,
      productName: 'Intel Core i7-13700K',
      quantity: 10,
      unitCost: 10500,
      totalCost: 105000,
      purchaseDate: '2025-08-01',
      supplier: '順發電腦',
      notes: '促銷價格'
    },
    {
      id: 2,
      productId: 2,
      productName: 'NVIDIA RTX 4070',
      quantity: 5,
      unitCost: 16500,
      totalCost: 82500,
      purchaseDate: '2025-08-03',
      supplier: '原價屋',
      notes: ''
    },
    {
      id: 3,
      productId: 4,
      productName: 'Corsair DDR5-5600 16GB',
      quantity: 20,
      unitCost: 2800,
      totalCost: 56000,
      purchaseDate: '2025-08-05',
      supplier: '建達國際',
      notes: '批發價'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 過濾指定月份的進貨記錄
        const monthStart = startOfMonth(new Date(selectedMonth + '-01'));
        const monthEnd = endOfMonth(new Date(selectedMonth + '-01'));
        
        const filteredPurchases = mockPurchases.filter(purchase => {
          const purchaseDate = new Date(purchase.purchaseDate);
          return purchaseDate >= monthStart && purchaseDate <= monthEnd;
        });
        
        setPurchases(filteredPurchases);
        setProducts(mockProducts);
      } catch (error) {
        console.error('獲取數據失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth]);

  const calculateMonthlyTotal = () => {
    return purchases.reduce((total, purchase) => total + purchase.totalCost, 0);
  };

  const handleAddPurchase = async (e) => {
    e.preventDefault();
    
    // 驗證必填欄位
    const hasProduct = newPurchase.isCustomProduct ? newPurchase.customProductName : newPurchase.productId;
    if (!hasProduct || !newPurchase.quantity || !newPurchase.unitCost) {
      alert('請填寫所有必填欄位');
      return;
    }

    try {
      setLoading(true);
      
      let productName;
      let productId;
      
      if (newPurchase.isCustomProduct) {
        productName = newPurchase.customProductName;
        productId = 'custom-' + Date.now(); // 為自訂商品生成唯一ID
      } else {
        const selectedProduct = products.find(p => p.id === parseInt(newPurchase.productId));
        productName = selectedProduct.name;
        productId = parseInt(newPurchase.productId);
      }
      
      const totalCost = parseFloat(newPurchase.quantity) * parseFloat(newPurchase.unitCost);
      
      const purchaseRecord = {
        id: Date.now(),
        productId: productId,
        productName: productName,
        isCustomProduct: newPurchase.isCustomProduct,
        quantity: parseInt(newPurchase.quantity),
        unitCost: parseFloat(newPurchase.unitCost),
        totalCost: totalCost,
        purchaseDate: newPurchase.purchaseDate,
        supplier: newPurchase.supplier,
        notes: newPurchase.notes
      };

      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 檢查是否在當前選擇的月份內
      const purchaseMonth = format(new Date(newPurchase.purchaseDate), 'yyyy-MM');
      if (purchaseMonth === selectedMonth) {
        setPurchases(prev => [...prev, purchaseRecord]);
      }
      
      // 重置表單
      setNewPurchase({
        productId: '',
        customProductName: '',
        isCustomProduct: false,
        quantity: '',
        unitCost: '',
        purchaseDate: format(new Date(), 'yyyy-MM-dd'),
        supplier: '',
        notes: ''
      });
      setShowAddForm(false);
      
      alert('進貨記錄新增成功！');
    } catch (error) {
      alert('新增失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePurchase = async (purchaseId) => {
    if (!window.confirm('確定要刪除這筆進貨記錄嗎？')) {
      return;
    }

    try {
      setLoading(true);
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPurchases(prev => prev.filter(p => p.id !== purchaseId));
      alert('進貨記錄已刪除');
    } catch (error) {
      alert('刪除失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="purchase-page">
      <div className="page-header">
        <h1>📋 每月進貨管理</h1>
        <p>管理商品進貨記錄，追蹤每月採購成本</p>
      </div>

      <div className="month-selector">
        <label htmlFor="month-picker">選擇月份</label>
        <input
          id="month-picker"
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

      <div className="monthly-summary">
        <div className="summary-card">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>當月進貨總額</h3>
            <div className="card-value">NT$ {calculateMonthlyTotal().toLocaleString()}</div>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon">📦</div>
          <div className="card-content">
            <h3>進貨筆數</h3>
            <div className="card-value">{purchases.length} 筆</div>
          </div>
        </div>
      </div>

      <div className="purchases-section">
        <div className="section-header">
          <h2>進貨記錄</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="add-purchase-btn"
          >
            {showAddForm ? '取消新增' : '+ 新增進貨'}
          </button>
        </div>

        {showAddForm && (
          <div className="add-purchase-form">
            <h3>新增進貨記錄</h3>
            <form onSubmit={handleAddPurchase}>
              <div className="form-grid">
                <div className="form-group">
                  <label>商品類型 *</label>
                  <div className="product-type-selector">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="productType"
                        checked={!newPurchase.isCustomProduct}
                        onChange={() => setNewPurchase(prev => ({ 
                          ...prev, 
                          isCustomProduct: false, 
                          productId: '', 
                          customProductName: '' 
                        }))}
                      />
                      選擇現有商品
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="productType"
                        checked={newPurchase.isCustomProduct}
                        onChange={() => setNewPurchase(prev => ({ 
                          ...prev, 
                          isCustomProduct: true, 
                          productId: '', 
                          customProductName: '' 
                        }))}
                      />
                      自訂商品名稱
                    </label>
                  </div>
                </div>
                
                {!newPurchase.isCustomProduct ? (
                  <div className="form-group">
                    <label>選擇商品 *</label>
                    <select
                      value={newPurchase.productId}
                      onChange={(e) => setNewPurchase(prev => ({ ...prev, productId: e.target.value }))}
                      required
                    >
                      <option value="">選擇商品</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name} ({product.category})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="form-group">
                    <label>自訂商品名稱 *</label>
                    <input
                      type="text"
                      value={newPurchase.customProductName}
                      onChange={(e) => setNewPurchase(prev => ({ ...prev, customProductName: e.target.value }))}
                      placeholder="請輸入商品名稱"
                      required
                    />
                  </div>
                )}
                <div className="form-group">
                  <label>數量 *</label>
                  <input
                    type="number"
                    min="1"
                    value={newPurchase.quantity}
                    onChange={(e) => setNewPurchase(prev => ({ ...prev, quantity: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>單價 (NT$) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newPurchase.unitCost}
                    onChange={(e) => setNewPurchase(prev => ({ ...prev, unitCost: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>進貨日期 *</label>
                  <input
                    type="date"
                    value={newPurchase.purchaseDate}
                    onChange={(e) => setNewPurchase(prev => ({ ...prev, purchaseDate: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>供應商</label>
                  <input
                    type="text"
                    value={newPurchase.supplier}
                    onChange={(e) => setNewPurchase(prev => ({ ...prev, supplier: e.target.value }))}
                    placeholder="供應商名稱"
                  />
                </div>
                <div className="form-group">
                  <label>備註</label>
                  <input
                    type="text"
                    value={newPurchase.notes}
                    onChange={(e) => setNewPurchase(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="備註說明"
                  />
                </div>
              </div>
              {newPurchase.quantity && newPurchase.unitCost && (
                <div className="total-preview">
                  <strong>總金額: NT$ {(parseFloat(newPurchase.quantity || 0) * parseFloat(newPurchase.unitCost || 0)).toLocaleString()}</strong>
                </div>
              )}
              <div className="form-actions">
                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? '新增中...' : '新增進貨'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="cancel-btn"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="purchases-table-container">
          {loading && purchases.length === 0 ? (
            <div className="loading">載入中...</div>
          ) : purchases.length === 0 ? (
            <div className="no-data">
              <p>本月暫無進貨記錄</p>
            </div>
          ) : (
            <table className="purchases-table">
              <thead>
                <tr>
                  <th>商品名稱</th>
                  <th>數量</th>
                  <th>單價</th>
                  <th>總金額</th>
                  <th>進貨日期</th>
                  <th>供應商</th>
                  <th>備註</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map(purchase => (
                  <tr key={purchase.id}>
                    <td className="product-name">
                      {purchase.productName}
                      {purchase.isCustomProduct && <span className="custom-badge">自訂</span>}
                    </td>
                    <td className="quantity">{purchase.quantity}</td>
                    <td className="unit-cost">NT$ {purchase.unitCost.toLocaleString()}</td>
                    <td className="total-cost">NT$ {purchase.totalCost.toLocaleString()}</td>
                    <td>{purchase.purchaseDate}</td>
                    <td>{purchase.supplier || '-'}</td>
                    <td>{purchase.notes || '-'}</td>
                    <td>
                      <button
                        onClick={() => handleDeletePurchase(purchase.id)}
                        className="delete-btn"
                        disabled={loading}
                      >
                        刪除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchasePage;
