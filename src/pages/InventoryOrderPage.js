import React, { useState, useEffect } from 'react';
import './InventoryOrderPage.css';

const InventoryOrderPage = () => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'CPU',
    stock: 0,
    price: 0,
    specs: {}
  });
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [completedOrders, setCompletedOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editingOrderData, setEditingOrderData] = useState(null);
  const [showStockAdjustment, setShowStockAdjustment] = useState(null);
  const [stockAdjustmentValue, setStockAdjustmentValue] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showPriceEdit, setShowPriceEdit] = useState(null);
  const [newPrice, setNewPrice] = useState(0);
  const [showOrderDetails, setShowOrderDetails] = useState(null);

  // 產品分類定義
  const categories = [
    { id: 'All', name: '全部', icon: '📦' },
    { id: 'CPU', name: 'CPU', icon: '🔧' },
    { id: 'GPU', name: 'GPU', icon: '🎮' },
    { id: 'Motherboard', name: '主機板', icon: '🔌' },
    { id: 'RAM', name: '記憶體', icon: '💾' },
    { id: 'SSD', name: '固態硬碟', icon: '💽' },
    { id: 'HDD', name: '傳統硬碟', icon: '💿' },
    { id: 'PSU', name: '電源供應器', icon: '⚡' },
    { id: 'Cooler', name: '散熱器', icon: '❄️' },
    { id: 'Case', name: '機殼', icon: '📦' }
  ];

  // 模擬產品數據 - 擴展電腦零組件類別
  const mockProducts = [
    { id: 1, name: 'Intel Core i7-13700K', category: 'CPU', stock: 15, price: 12000, specs: { socket: 'LGA1700', cores: '16', threads: '24', frequency: '3.4GHz' } },
    { id: 2, name: 'AMD Ryzen 7 7700X', category: 'CPU', stock: 12, price: 11000, specs: { socket: 'AM5', cores: '8', threads: '16', frequency: '4.5GHz' } },
    { id: 3, name: 'NVIDIA RTX 4070', category: 'GPU', stock: 8, price: 18000, specs: { memory: '12GB', interface: 'PCIe 4.0', powerConsumption: '200W' } },
    { id: 4, name: 'AMD RX 7600 XT', category: 'GPU', stock: 6, price: 15000, specs: { memory: '16GB', interface: 'PCIe 4.0', powerConsumption: '190W' } },
    { id: 5, name: 'ASUS ROG B650E-F', category: 'Motherboard', stock: 12, price: 8500, specs: { socket: 'AM5', chipset: 'B650E', formFactor: 'ATX' } },
    { id: 6, name: 'MSI Z790 Gaming Pro', category: 'Motherboard', stock: 10, price: 9200, specs: { socket: 'LGA1700', chipset: 'Z790', formFactor: 'ATX' } },
    { id: 7, name: 'Corsair DDR5-5600 16GB', category: 'RAM', stock: 25, price: 3200, specs: { capacity: '16GB', speed: '5600MHz', type: 'DDR5' } },
    { id: 8, name: 'G.Skill Trident Z5 32GB', category: 'RAM', stock: 18, price: 6400, specs: { capacity: '32GB', speed: '6000MHz', type: 'DDR5' } },
    { id: 9, name: 'Samsung 980 PRO 1TB', category: 'SSD', stock: 20, price: 3800, specs: { capacity: '1TB', interface: 'NVMe', speed: '7000MB/s' } },
    { id: 10, name: 'WD Black SN850X 2TB', category: 'SSD', stock: 15, price: 6800, specs: { capacity: '2TB', interface: 'NVMe', speed: '7300MB/s' } },
    { id: 11, name: 'Seagate Barracuda 4TB', category: 'HDD', stock: 22, price: 2800, specs: { capacity: '4TB', interface: 'SATA', rpm: '7200RPM' } },
    { id: 12, name: 'Corsair RM850x', category: 'PSU', stock: 18, price: 4200, specs: { wattage: '850W', certification: '80+ Gold', modular: 'Full' } },
    { id: 13, name: 'Seasonic Focus GX-1000', category: 'PSU', stock: 14, price: 5500, specs: { wattage: '1000W', certification: '80+ Gold', modular: 'Full' } },
    { id: 14, name: 'Noctua NH-D15', category: 'Cooler', stock: 16, price: 2800, specs: { type: 'Air', height: '165mm', socket: 'Multi' } },
    { id: 15, name: 'Corsair H100i Elite', category: 'Cooler', stock: 12, price: 3500, specs: { type: 'AIO', radiator: '240mm', socket: 'Multi' } },
    { id: 16, name: 'Fractal Design Define 7', category: 'Case', stock: 8, price: 4500, specs: { formFactor: 'Mid Tower', material: 'Steel', color: 'Black' } }
  ];

  // 模擬客戶數據
  const mockCustomers = [
    { id: 1, name: '張先生', phone: '0912-345-678', email: 'zhang@email.com' },
    { id: 2, name: '李小姐', phone: '0923-456-789', email: 'li@email.com' },
    { id: 3, name: '王先生', phone: '0934-567-890', email: 'wang@email.com' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setProducts(mockProducts);
        setCustomers(mockCustomers);
        
        // 載入保存的訂單記錄
        const savedOrders = JSON.parse(localStorage.getItem('completedOrders') || '[]');
        setCompletedOrders(savedOrders);
        setIsInitialLoad(false); // 標記初始載入完成
      } catch (error) {
        console.error('獲取數據失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 保存訂單記錄到localStorage (避免在初始載入時覆蓋已保存的數據)
  useEffect(() => {
    if (!isInitialLoad) {
      localStorage.setItem('completedOrders', JSON.stringify(completedOrders));
    }
  }, [completedOrders, isInitialLoad]);

  const addToOrder = (product) => {
    // 檢查庫存是否足夠
    if (product.stock <= 0) {
      alert('庫存不足，無法加入訂單');
      return;
    }

    const existingItem = orderItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      // 檢查加入後是否會超過庫存
      if (0 >= product.stock) {
        alert('庫存不足，無法再新增更多數量');
        return;
      }
      
      setOrderItems(prev => prev.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setOrderItems(prev => [...prev, {
        productId: product.id,
        productName: product.name,
        productCategory: product.category,
        quantity: 1,
        price: product.price,
        specs: { ...product.specs }
      }]);
    }

    // 即時扣除庫存
    setProducts(prev => prev.map(p =>
      p.id === product.id
        ? { ...p, stock: p.stock - 1 }
        : p
    ));
  };

  // 新增產品到庫存
  const addNewProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      alert('請填寫產品名稱和價格');
      return;
    }

    const productToAdd = {
      id: products.length + Date.now(), // 簡單的 ID 生成
      name: newProduct.name,
      category: newProduct.category,
      stock: parseInt(newProduct.stock),
      price: parseInt(newProduct.price),
      specs: { ...newProduct.specs }
    };

    setProducts(prev => [...prev, productToAdd]);
    
    // 重置表單
    setNewProduct({
      name: '',
      category: 'CPU',
      stock: 0,
      price: 0,
      specs: {}
    });
    setShowNewProductForm(false);
    alert(`產品新增成功！已加入 ${productToAdd.category} 分類`);
  };

  // 新增規格到新產品
  const addSpecToNewProduct = () => {
    if (!newSpecKey || !newSpecValue) {
      alert('請填寫規格名稱和值');
      return;
    }

    setNewProduct(prev => ({
      ...prev,
      specs: {
        ...prev.specs,
        [newSpecKey]: newSpecValue
      }
    }));

    setNewSpecKey('');
    setNewSpecValue('');
  };

  // 移除新產品的規格
  const removeSpecFromNewProduct = (specKey) => {
    setNewProduct(prev => ({
      ...prev,
      specs: Object.fromEntries(
        Object.entries(prev.specs).filter(([key]) => key !== specKey)
      )
    }));
  };

  const updateOrderItem = (productId, field, value) => {
    setOrderItems(prev => prev.map(item =>
      item.productId === productId
        ? { ...item, [field]: value }
        : item
    ));
  };

  const removeFromOrder = (productId) => {
    const removedItem = orderItems.find(item => item.productId === productId);
    if (removedItem) {
      // 還原庫存
      setProducts(prev => prev.map(p =>
        p.id === productId
          ? { ...p, stock: p.stock + removedItem.quantity }
          : p
      ));
    }
    
    setOrderItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateItemSpecs = (productId, specKey, specValue) => {
    setOrderItems(prev => prev.map(item =>
      item.productId === productId
        ? { ...item, specs: { ...item.specs, [specKey]: specValue } }
        : item
    ));
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  const handleSubmitOrder = async () => {
    if (orderItems.length === 0) {
      alert('請至少新增一個商品到訂單');
      return;
    }

    try {
      setLoading(true);
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 建立訂單物件
      const newOrder = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        items: [...orderItems],
        totalAmount: calculateTotal(),
        status: '待收訂金',
        customerName: selectedCustomer ? customers.find(c => c.id.toString() === selectedCustomer)?.name || '' : newCustomer.name,
        customerPhone: selectedCustomer ? customers.find(c => c.id.toString() === selectedCustomer)?.phone || '' : newCustomer.phone,
        customerEmail: selectedCustomer ? customers.find(c => c.id.toString() === selectedCustomer)?.email || '' : newCustomer.email
      };
      
      // 將新訂單加入已完成訂單列表
      setCompletedOrders(prev => [newOrder, ...prev]);
      
      alert('訂單建立成功！請查看下方的訂單記錄。');
      
      // 重置表單
      setOrderItems([]);
      setSelectedCustomer('');
      setNewCustomer({ name: '', phone: '', email: '' });
      setShowNewCustomerForm(false);
    } catch (error) {
      alert('訂單建立失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  // 開始編輯訂單
  const startEditOrder = (order) => {
    setEditingOrder(order.id);
    setEditingOrderData({
      ...order,
      customerName: order.customerName || '',
      customerPhone: order.customerPhone || '',
      customerEmail: order.customerEmail || '',
      items: [...order.items]
    });
  };

  // 取消編輯訂單
  const cancelEditOrder = () => {
    setEditingOrder(null);
    setEditingOrderData(null);
  };

  // 更新編輯中訂單的客戶資訊
  const updateEditingOrderCustomer = (field, value) => {
    setEditingOrderData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 更新編輯中訂單的商品數量
  const updateEditingOrderItemQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) return;
    
    setEditingOrderData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      ),
      totalAmount: prev.items
        .map(item =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
        .reduce((total, item) => total + (item.quantity * item.price), 0)
    }));
  };

  // 從編輯中的訂單移除商品
  const removeItemFromEditingOrder = (productId) => {
    const removedItem = editingOrderData.items.find(item => item.productId === productId);
    
    setEditingOrderData(prev => {
      const newItems = prev.items.filter(item => item.productId !== productId);
      return {
        ...prev,
        items: newItems,
        totalAmount: newItems.reduce((total, item) => total + (item.quantity * item.price), 0)
      };
    });

    // 還原庫存
    if (removedItem) {
      setProducts(prev => prev.map(p =>
        p.id === productId
          ? { ...p, stock: p.stock + removedItem.quantity }
          : p
      ));
    }
  };

  // 儲存編輯後的訂單
  const saveEditedOrder = () => {
    if (editingOrderData.items.length === 0) {
      alert('訂單至少需要包含一個商品');
      return;
    }

    setCompletedOrders(prev => prev.map(order =>
      order.id === editingOrder
        ? {
            ...editingOrderData,
            date: `${order.date} (已修改: ${new Date().toLocaleString()})`
          }
        : order
    ));

    alert('訂單修改成功！');
    setEditingOrder(null);
    setEditingOrderData(null);
  };

  // 添加商品到編輯中的訂單
  const addProductToEditingOrder = (product) => {
    if (product.stock <= 0) {
      alert('庫存不足，無法加入訂單');
      return;
    }

    const existingItem = editingOrderData.items.find(item => item.productId === product.id);
    
    if (existingItem) {
      updateEditingOrderItemQuantity(product.id, existingItem.quantity + 1);
    } else {
      setEditingOrderData(prev => {
        const newItems = [...prev.items, {
          productId: product.id,
          productName: product.name,
          productCategory: product.category,
          quantity: 1,
          price: product.price,
          specs: { ...product.specs }
        }];
        return {
          ...prev,
          items: newItems,
          totalAmount: newItems.reduce((total, item) => total + (item.quantity * item.price), 0)
        };
      });
    }

    // 扣除庫存
    setProducts(prev => prev.map(p =>
      p.id === product.id
        ? { ...p, stock: p.stock - 1 }
        : p
    ));
  };

  // 刪除訂單
  const deleteOrder = (orderId) => {
    if (window.confirm('確定要刪除這個訂單嗎？此操作無法復原。')) {
      // 如果訂單正在編輯中，先取消編輯
      if (editingOrder === orderId) {
        setEditingOrder(null);
        setEditingOrderData(null);
      }
      
      // 從訂單列表中移除（不還原庫存）
      setCompletedOrders(prev => prev.filter(order => order.id !== orderId));
      
      alert('訂單已成功刪除！');
    }
  };

  // 清除所有訂單記錄
  const clearAllOrders = () => {
    if (window.confirm('確定要清除所有訂單記錄嗎？此操作無法復原，所有商品庫存將會還原。')) {
      // 還原所有訂單的庫存
      completedOrders.forEach(order => {
        order.items.forEach(item => {
          setProducts(prev => prev.map(p =>
            p.id === item.productId
              ? { ...p, stock: p.stock + item.quantity }
              : p
          ));
        });
      });
      
      // 清除訂單記錄
      setCompletedOrders([]);
      // 立即清除localStorage中的數據
      localStorage.removeItem('completedOrders');
      
      // 取消任何正在編輯的訂單
      setEditingOrder(null);
      setEditingOrderData(null);
      
      alert('所有訂單記錄已清除，庫存已還原！');
    }
  };

  // 推送訂單到OrderSummaryPage
  const pushOrderToSummary = (order) => {
    // 轉換訂單格式以符合OrderSummaryPage的需求
    const summaryOrder = {
      id: `ORD-${order.id}`,
      customer: order.customerName || '未提供',
      customerUrl: order.customerEmail ? `mailto:${order.customerEmail}` : '#',
      amount: order.totalAmount,
      status: '待收訂金',
      date: new Date().toISOString().split('T')[0], // 格式化為 YYYY-MM-DD
      cost: Math.round(order.totalAmount * 0.8), // 假設成本為80%
      notes: '來自庫存頁面',
      items: order.items,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail
    };

    // 使用localStorage來在頁面間傳遞數據
    const existingOrders = JSON.parse(localStorage.getItem('summaryOrders') || '[]');
    const updatedOrders = [summaryOrder, ...existingOrders];
    localStorage.setItem('summaryOrders', JSON.stringify(updatedOrders));

    // 更新本地訂單狀態為已收訂金
    setCompletedOrders(prev => prev.map(o => 
      o.id === order.id ? { ...o, status: '已收訂金' } : o
    ));

    alert('訂單已成功推送到訂單總覽頁面，狀態已更新為已收訂金！');
  };

  // 開始庫存調整
  const startStockAdjustment = (productId) => {
    setShowStockAdjustment(productId);
    setStockAdjustmentValue(0);
  };

  // 取消庫存調整
  const cancelStockAdjustment = () => {
    setShowStockAdjustment(null);
    setStockAdjustmentValue(0);
  };

  // 確認庫存調整
  const confirmStockAdjustment = (productId) => {
    const adjustmentValue = parseInt(stockAdjustmentValue);
    if (isNaN(adjustmentValue) || adjustmentValue === 0) {
      alert('請輸入有效的調整數量');
      return;
    }

    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        const newStock = Math.max(0, product.stock + adjustmentValue);
        return { ...product, stock: newStock };
      }
      return product;
    }));

    // 記錄庫存調整歷史
    const product = products.find(p => p.id === productId);
    const adjustmentRecord = {
      id: Date.now(),
      productId,
      productName: product.name,
      adjustment: adjustmentValue,
      oldStock: product.stock,
      newStock: Math.max(0, product.stock + adjustmentValue),
      date: new Date().toLocaleString(),
      reason: adjustmentValue > 0 ? '手動增加' : '手動減少'
    };

    // 保存調整記錄到localStorage
    const existingRecords = JSON.parse(localStorage.getItem('stockAdjustments') || '[]');
    localStorage.setItem('stockAdjustments', JSON.stringify([adjustmentRecord, ...existingRecords]));

    alert(`庫存調整成功！${product.name} 庫存${adjustmentValue > 0 ? '增加' : '減少'}了 ${Math.abs(adjustmentValue)} 個`);
    
    setShowStockAdjustment(null);
    setStockAdjustmentValue(0);
  };

  // 開始價格編輯
  const startPriceEdit = (productId, currentPrice) => {
    setShowPriceEdit(productId);
    setNewPrice(currentPrice);
  };

  // 取消價格編輯
  const cancelPriceEdit = () => {
    setShowPriceEdit(null);
    setNewPrice(0);
  };

  // 確認價格修改
  const confirmPriceEdit = (productId) => {
    const priceValue = parseInt(newPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      alert('請輸入有效的價格');
      return;
    }

    const oldPrice = products.find(p => p.id === productId)?.price;
    
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        return { ...product, price: priceValue };
      }
      return product;
    }));

    alert(`價格修改成功！從 NT$ ${oldPrice?.toLocaleString()} 修改為 NT$ ${priceValue.toLocaleString()}`);
    
    setShowPriceEdit(null);
    setNewPrice(0);
  };

  // 顯示訂單詳情彈出視窗
  const showOrderDetailsModal = (order) => {
    setShowOrderDetails(order);
  };

  // 關閉訂單詳情彈出視窗
  const closeOrderDetailsModal = () => {
    setShowOrderDetails(null);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'CPU': '🔧',
      'GPU': '🎮',
      'Motherboard': '🔌',
      'RAM': '💾',
      'SSD': '💽',
      'HDD': '💿',
      'PSU': '⚡',
      'Cooler': '❄️',
      'Case': '📦'
    };
    return icons[category] || '🔧';
  };

  // 過濾產品根據選擇的分類
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  // 獲取每個分類的產品數量
  const getCategoryCount = (categoryId) => {
    if (categoryId === 'All') return products.length;
    return products.filter(product => product.category === categoryId).length;
  };

  if (loading && products.length === 0) {
    return <div className="loading">載入中...</div>;
  }

  return (
    <div className="inventory-order-page">
      <div className="page-header">
        <h1>📦 庫存與下單整合</h1>
        <p>瀏覽庫存商品，選擇客戶並建立訂單</p>
      </div>

      <div className="page-content">
        <div className="inventory-section">
          <div className="inventory-header">
            <h2>商品庫存</h2>
            <button
              onClick={() => setShowNewProductForm(!showNewProductForm)}
              className="add-product-btn"
            >
              {showNewProductForm ? '取消新增' : '➕ 新增產品'}
            </button>
          </div>

          {/* 分類標籤區域 */}
          <div className="category-tabs">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
                <span className="category-count">({getCategoryCount(category.id)})</span>
              </button>
            ))}
          </div>

          {showNewProductForm && (
            <div className="new-product-form">
              <h3>新增庫存產品</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>產品名稱</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="請輸入產品名稱"
                  />
                </div>
                <div className="form-group">
                  <label>類別</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="CPU">CPU</option>
                    <option value="GPU">GPU</option>
                    <option value="Motherboard">主機板</option>
                    <option value="RAM">記憶體</option>
                    <option value="SSD">固態硬碟</option>
                    <option value="HDD">傳統硬碟</option>
                    <option value="PSU">電源供應器</option>
                    <option value="Cooler">散熱器</option>
                    <option value="Case">機殼</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>庫存數量</label>
                  <input
                    type="number"
                    min="0"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
                    placeholder="庫存數量"
                  />
                </div>
                <div className="form-group">
                  <label>價格 (NT$)</label>
                  <input
                    type="number"
                    min="0"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="產品價格"
                  />
                </div>
              </div>
              
              <div className="specs-section">
                <h4>產品規格</h4>
                <div className="spec-input-row">
                  <input
                    type="text"
                    value={newSpecKey}
                    onChange={(e) => setNewSpecKey(e.target.value)}
                    placeholder="規格名稱 (如: socket)"
                  />
                  <input
                    type="text"
                    value={newSpecValue}
                    onChange={(e) => setNewSpecValue(e.target.value)}
                    placeholder="規格值 (如: LGA1700)"
                  />
                  <button onClick={addSpecToNewProduct} className="add-spec-btn">新增規格</button>
                </div>
                
                {Object.entries(newProduct.specs).length > 0 && (
                  <div className="current-specs">
                    <h5>目前規格:</h5>
                    {Object.entries(newProduct.specs).map(([key, value]) => (
                      <div key={key} className="spec-item">
                        <span>{key}: {value}</span>
                        <button
                          onClick={() => removeSpecFromNewProduct(key)}
                          className="remove-spec-btn"
                        >
                          ❌
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="form-actions">
                <button onClick={addNewProduct} className="save-product-btn">
                  💾 儲存產品
                </button>
                <button 
                  onClick={() => setShowNewProductForm(false)} 
                  className="cancel-btn"
                >
                  取消
                </button>
              </div>
            </div>
          )}

          <div className="products-grid">
            {filteredProducts.length === 0 ? (
              <div className="no-products">
                {selectedCategory === 'All' ? '暫無商品' : `${categories.find(c => c.id === selectedCategory)?.name} 分類暫無商品`}
              </div>
            ) : (
              filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-header">
                    <span className="category-icon">{getCategoryIcon(product.category)}</span>
                    <span className="category-label">{product.category}</span>
                  </div>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-info">
                    <div className="price">
                      {showPriceEdit === product.id ? (
                        <div className="price-edit">
                          <input
                            type="number"
                            min="1"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            className="price-input"
                            placeholder="新價格"
                          />
                          <div className="price-edit-actions">
                            <button
                              onClick={() => confirmPriceEdit(product.id)}
                              className="confirm-price-btn"
                              title="確認修改"
                            >
                              ✅
                            </button>
                            <button
                              onClick={cancelPriceEdit}
                              className="cancel-price-btn"
                              title="取消修改"
                            >
                              ❌
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="price-display">
                          <span>NT$ {product.price.toLocaleString()}</span>
                          <button
                            onClick={() => startPriceEdit(product.id, product.price)}
                            className="edit-price-btn"
                            title="編輯價格"
                          >
                            ✏️
                          </button>
                        </div>
                      )}
                    </div>
                    <div className={`stock ${product.stock < 5 ? 'low' : ''}`}>
                      庫存: {product.stock}
                    </div>
                  </div>
                  <div className="product-specs">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <span key={key} className="spec-item">
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                  <div className="product-actions">
                    <button
                      onClick={() => addToOrder(product)}
                      className="add-to-order-btn"
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0 ? '缺貨' : '加入訂單'}
                    </button>
                    <button
                      onClick={() => startStockAdjustment(product.id)}
                      className="adjust-stock-btn"
                      title="調整庫存"
                    >
                      📦 調整庫存
                    </button>
                  </div>
                  
                  {showStockAdjustment === product.id && (
                    <div className="stock-adjustment-panel">
                      <h4>調整庫存</h4>
                      <div className="adjustment-info">
                        <span>目前庫存: {product.stock}</span>
                      </div>
                      <div className="adjustment-input">
                        <label>調整數量 (正數增加，負數減少):</label>
                        <input
                          type="number"
                          value={stockAdjustmentValue}
                          onChange={(e) => setStockAdjustmentValue(e.target.value)}
                          placeholder="輸入調整數量"
                          className="adjustment-value-input"
                        />
                      </div>
                      <div className="adjustment-preview">
                        調整後庫存: {Math.max(0, product.stock + parseInt(stockAdjustmentValue || 0))}
                      </div>
                      <div className="adjustment-actions">
                        <button
                          onClick={() => confirmStockAdjustment(product.id)}
                          className="confirm-adjustment-btn"
                        >
                          ✅ 確認調整
                        </button>
                        <button
                          onClick={cancelStockAdjustment}
                          className="cancel-adjustment-btn"
                        >
                          ❌ 取消
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="order-section">
          <h2>建立訂單</h2>
          
          {/* 客戶資訊選擇 */}
          <div className="customer-section">
            <h3>客戶資訊 (選填)</h3>
            <div className="customer-selection">
              <div className="form-group">
                <label>選擇現有客戶</label>
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                >
                  <option value="">-- 請選擇客戶 --</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} ({customer.phone})
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setShowNewCustomerForm(!showNewCustomerForm)}
                className="toggle-customer-form-btn"
              >
                {showNewCustomerForm ? '取消新增客戶' : '+ 新增客戶'}
              </button>
            </div>

            {showNewCustomerForm && (
              <div className="new-customer-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>客戶姓名</label>
                    <input
                      type="text"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="請輸入客戶姓名"
                    />
                  </div>
                  <div className="form-group">
                    <label>客戶電話</label>
                    <input
                      type="text"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="請輸入客戶電話"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>客戶Email (選填)</label>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="請輸入客戶Email"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* 訂單項目 */}
          <div className="order-items-section">
            <h3>訂單項目</h3>
            {orderItems.length === 0 ? (
              <div className="no-items">尚未新增任何商品到訂單</div>
            ) : (
              <div className="order-items-list">
                {orderItems.map(item => (
                  <div key={item.productId} className="order-item">
                    <div className="item-info">
                      <div className="item-header">
                        <span className="category-icon">{getCategoryIcon(item.productCategory)}</span>
                        <span className="category-label">{item.productCategory}</span>
                        <h4>{item.productName}</h4>
                      </div>
                      <div className="item-controls">
                        <div className="quantity-control">
                          <label>數量</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateOrderItem(item.productId, 'quantity', parseInt(e.target.value))}
                          />
                        </div>
                        <div className="price-display">
                          <span>單價: NT$ {item.price.toLocaleString()}</span>
                          <span>小計: NT$ {(item.quantity * item.price).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="specs-customization">
                        <h5>規格設定</h5>
                        {Object.entries(item.specs).map(([key, value]) => (
                          <div key={key} className="spec-input">
                            <label>{key}</label>
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => updateItemSpecs(item.productId, key, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromOrder(item.productId)}
                      className="remove-item-btn"
                    >
                      移除
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 訂單總計 */}
          {orderItems.length > 0 && (
            <div className="order-summary">
              <div className="total-amount">
                <strong>總金額: NT$ {calculateTotal().toLocaleString()}</strong>
              </div>
              <button
                onClick={handleSubmitOrder}
                disabled={loading}
                className="submit-order-btn"
              >
                {loading ? '建立中...' : '建立訂單'}
              </button>
            </div>
          )}
        </div>

        {/* 訂單記錄區域 */}
        <div className="order-history-section">
          <div className="order-history-header">
            <h2>📋 訂單記錄</h2>
            <div className="order-history-actions">
              <span className="order-count">共 {completedOrders.length} 筆訂單</span>
            </div>
          </div>
          
          {completedOrders.length === 0 ? (
            <div className="no-orders">
              <p>尚未有任何訂單記錄</p>
              <small>建立訂單後，記錄將會自動保存並顯示在這裡</small>
            </div>
          ) : (
            <div className="orders-table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>詳情</th>
                    <th>訂單編號</th>
                    <th>建立時間</th>
                    <th>客戶資訊</th>
                    <th>總金額</th>
                    <th>狀態</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {completedOrders.map(order => (
                    <tr key={order.id}>
                      <td className="details-cell">
                        <button
                          onClick={() => showOrderDetailsModal(order)}
                          className="details-btn"
                          title="查看商品明細"
                        >
                          📋
                        </button>
                      </td>
                      <td className="order-id">#{order.id}</td>
                      <td className="order-date">{order.date}</td>
                      <td className="order-customer">
                        {editingOrder === order.id ? (
                          <div className="editing-customer-info">
                            <input
                              type="text"
                              value={editingOrderData.customerName}
                              onChange={(e) => updateEditingOrderCustomer('customerName', e.target.value)}
                              placeholder="客戶姓名"
                              className="small-input"
                            />
                            <input
                              type="text"
                              value={editingOrderData.customerPhone}
                              onChange={(e) => updateEditingOrderCustomer('customerPhone', e.target.value)}
                              placeholder="客戶電話"
                              className="small-input"
                            />
                            <input
                              type="email"
                              value={editingOrderData.customerEmail}
                              onChange={(e) => updateEditingOrderCustomer('customerEmail', e.target.value)}
                              placeholder="客戶Email"
                              className="small-input"
                            />
                          </div>
                        ) : (
                          <div className="customer-info">
                            {order.customerName && (
                              <div className="customer-name">👤 {order.customerName}</div>
                            )}
                            {order.customerPhone && (
                              <div className="customer-phone">📞 {order.customerPhone}</div>
                            )}
                            {order.customerEmail && (
                              <div className="customer-email">📧 {order.customerEmail}</div>
                            )}
                            {!order.customerName && !order.customerPhone && !order.customerEmail && (
                              <span className="no-customer">未提供客戶資訊</span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="order-total">
                        <strong>NT$ {(editingOrder === order.id ? editingOrderData.totalAmount : order.totalAmount).toLocaleString()}</strong>
                      </td>
                      <td className="order-status">
                        <span className={`status-badge ${order.status === '已收訂金' ? 'completed' : 'pending'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="order-actions">
                        {editingOrder === order.id ? (
                          <div className="editing-actions">
                            <button
                              onClick={saveEditedOrder}
                              className="save-btn"
                              title="儲存變更"
                            >
                              💾 儲存
                            </button>
                            <button
                              onClick={cancelEditOrder}
                              className="cancel-btn"
                              title="取消編輯"
                            >
                              ❌ 取消
                            </button>
                          </div>
                        ) : (
                          <div className="order-actions-group">
                            <button
                              onClick={() => startEditOrder(order)}
                              className="edit-btn"
                              title="編輯訂單"
                            >
                              ✏️ 編輯
                            </button>
                            <button
                              onClick={() => pushOrderToSummary(order)}
                              className={`push-btn ${order.status === '已收訂金' ? 'disabled' : ''}`}
                              title={order.status === '待收訂金' ? "收取訂金並推送" : "已推送至總覽"}
                              disabled={order.status === '已收訂金'}
                            >
                              {order.status === '待收訂金' ? '� 收取訂金' : '✅ 已收訂金'}
                            </button>
                            <button
                              onClick={() => deleteOrder(order.id)}
                              className="delete-btn"
                              title="刪除訂單"
                            >
                              🗑️ 刪除
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 訂單詳情彈出視窗 */}
      {showOrderDetails && (
        <div className="modal-overlay" onClick={closeOrderDetailsModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>訂單詳情 - #{showOrderDetails.id}</h3>
              <button className="close-btn" onClick={closeOrderDetailsModal}>
                ❌
              </button>
            </div>
            <div className="modal-body">
              <div className="order-info-section">
                <h4>訂單資訊</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <label>建立時間:</label>
                    <span>{showOrderDetails.date}</span>
                  </div>
                  <div className="info-item">
                    <label>訂單狀態:</label>
                    <span className={`status-badge ${showOrderDetails.status === '已收訂金' ? 'completed' : 'pending'}`}>
                      {showOrderDetails.status}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>總金額:</label>
                    <span className="total-amount">NT$ {showOrderDetails.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="customer-info-section">
                <h4>客戶資訊</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <label>客戶姓名:</label>
                    <span>{showOrderDetails.customerName || '未提供'}</span>
                  </div>
                  <div className="info-item">
                    <label>聯絡電話:</label>
                    <span>{showOrderDetails.customerPhone || '未提供'}</span>
                  </div>
                  <div className="info-item">
                    <label>電子郵件:</label>
                    <span>{showOrderDetails.customerEmail || '未提供'}</span>
                  </div>
                </div>
              </div>

              <div className="items-info-section">
                <h4>商品明細</h4>
                <div className="items-detail-list">
                  {showOrderDetails.items.map((item, index) => (
                    <div key={index} className="item-detail-card">
                      <div className="item-header">
                        <span className="category-icon">{getCategoryIcon(item.productCategory)}</span>
                        <span className="category-label">{item.productCategory}</span>
                        <h5 className="item-name">{item.productName}</h5>
                      </div>
                      <div className="item-details">
                        <div className="item-quantity">
                          <label>數量:</label>
                          <span>x{item.quantity}</span>
                        </div>
                      </div>
                      {Object.keys(item.specs).length > 0 && (
                        <div className="item-specs">
                          <label>規格:</label>
                          <div className="specs-list">
                            {Object.entries(item.specs).map(([key, value]) => (
                              <span key={key} className="spec-tag">
                                {key}: {value}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryOrderPage;
