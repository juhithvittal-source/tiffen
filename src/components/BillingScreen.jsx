import React, { useState, useMemo, useEffect } from 'react';
import { Search, ShoppingBag, UtensilsCrossed, AlertCircle } from 'lucide-react';
import TiffinCard from './TiffinCard';
import CartTable from './CartTable';
import BillSummary from './BillSummary';
import { DEFAULT_CATEGORIES } from '../data/defaultMenu';
import { formatKOTNumber } from '../utils/formatters';
import { sound } from '../utils/sound';

export default function BillingScreen({
  menu = [],
  kotNumber = 1,
  onGenerateOrder,
  onOpenManageMenu
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Cart state
  const [cartItems, setCartItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [orderType, setOrderType] = useState('Dine-In');
  const [errorMessage, setErrorMessage] = useState('');

  // Auto clear error when cart gets items
  useEffect(() => {
    if (cartItems.length > 0 && errorMessage) {
      setErrorMessage('');
    }
  }, [cartItems, errorMessage]);

  // Categories list ensuring 'All', 'Breakfast', 'Tiffins', 'Beverages', 'Special' are prominent
  const categories = useMemo(() => {
    const defaultCats = ['All', 'Breakfast', 'Tiffins', 'Beverages', 'Special'];
    const customCats = menu.map(m => m.category).filter(Boolean);
    const set = new Set([...defaultCats, ...customCats]);
    return Array.from(set);
  }, [menu]);

  // Filter menu items
  const filteredMenu = useMemo(() => {
    return menu.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [menu, selectedCategory, searchTerm]);

  // Cart operations
  const handleAddToCart = (tiffin) => {
    if (tiffin.available === false) return;
    sound.playTap();
    setCartItems((prevItems) => {
      const existing = prevItems.find((it) => it.id === tiffin.id);
      if (existing) {
        return prevItems.map((it) =>
          it.id === tiffin.id ? { ...it, quantity: it.quantity + 1, price: tiffin.price } : it
        );
      }
      return [
        ...prevItems,
        {
          id: tiffin.id,
          name: tiffin.name,
          price: tiffin.price,
          category: tiffin.category,
          quantity: 1
        }
      ];
    });
  };

  const handleUpdateQty = (itemId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    sound.playTap();
    setCartItems((prevItems) =>
      prevItems.map((it) => (it.id === itemId ? { ...it, quantity: newQty } : it))
    );
  };

  const handleRemoveItem = (itemId) => {
    sound.playDelete();
    setCartItems((prevItems) => prevItems.filter((it) => it.id !== itemId));
  };

  const handleClearOrder = () => {
    if (cartItems.length === 0) return;
    sound.playDelete();
    setCartItems([]);
    setDiscount(0);
    setErrorMessage('');
  };

  // Calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, it) => sum + (it.price * it.quantity), 0);
  }, [cartItems]);

  const effectiveDiscount = Math.min(discount, subtotal);
  const grandTotal = Math.max(0, subtotal - effectiveDiscount);
  const totalItems = cartItems.reduce((sum, it) => sum + it.quantity, 0);

  // Map for fast quantity lookup on cards
  const cartQtyMap = useMemo(() => {
    const map = {};
    cartItems.forEach((it) => {
      map[it.id] = it.quantity;
    });
    return map;
  }, [cartItems]);

  // Handle GENERATE ORDER
  const handleGenerateOrder = () => {
    if (cartItems.length === 0) {
      sound.playError ? sound.playError() : sound.playTap();
      setErrorMessage('Please add at least one item to generate the order.');
      return;
    }

    sound.playSuccess();
    
    // Save exact snapshot of prices at order time
    const newBill = {
      id: `bill-${Date.now()}`,
      kotNumber: formatKOTNumber(kotNumber),
      timestamp: new Date().toISOString(),
      orderType,
      items: cartItems.map(it => ({
        id: it.id,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        amount: it.price * it.quantity
      })),
      totalItems,
      subtotal,
      discount: effectiveDiscount,
      grandTotal
    };

    onGenerateOrder(newBill);

    // Clear cart immediately for the next order
    setCartItems([]);
    setDiscount(0);
    setErrorMessage('');
  };

  // Keyboard shortcut (Ctrl+Enter or Enter when not typing)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleGenerateOrder();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cartItems, kotNumber, effectiveDiscount, grandTotal, subtotal, orderType]);

  const formattedKOT = formatKOTNumber(kotNumber);

  return (
    <div className="billing-layout">
      {/* Left Column: TIFFIN MENU */}
      <div className="menu-panel">
        {/* Menu Header with Search */}
        <div className="menu-panel-header">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search tiffins... (e.g. Idly, Dosa, Tea)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="menu-search-input"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              {filteredMenu.length} tiffins
            </span>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="category-pills-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => {
                sound.playTap();
                setSelectedCategory(cat);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tiffins Grid */}
        <div className="tiffins-grid">
          {filteredMenu.map((tiffin) => (
            <TiffinCard
              key={tiffin.id}
              tiffin={tiffin}
              quantityInCart={cartQtyMap[tiffin.id] || 0}
              onAddToCart={handleAddToCart}
              onUpdateQty={handleUpdateQty}
            />
          ))}

          {filteredMenu.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                No tiffins match "{searchTerm}"
              </div>
              <div style={{ fontSize: '0.9rem', marginTop: '0.4rem' }}>
                You can add new tiffin items in{' '}
                <button 
                  type="button" 
                  onClick={onOpenManageMenu} 
                  style={{ color: 'var(--primary-600)', textDecoration: 'underline', fontWeight: 800 }}
                >
                  Manage Tiffins
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: CURRENT BILL */}
      <div className="cart-panel">
        {/* Current Order Header with live upcoming KOT Token */}
        <div className="cart-header">
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              CURRENT ORDER
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Upcoming Token for this bill
            </div>
          </div>

          <div className="kot-indicator">
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-800)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              KOT NO:
            </span>
            <span className="kot-badge">{formattedKOT}</span>
          </div>
        </div>

        {/* Bill Table: | Item | Price | Qty | Amount | */}
        <CartTable
          items={cartItems}
          onUpdateQty={handleUpdateQty}
          onRemoveItem={handleRemoveItem}
        />

        {/* Live Automatic Calculation & GENERATE ORDER Button */}
        <BillSummary
          subtotal={subtotal}
          discount={discount}
          grandTotal={grandTotal}
          totalItems={totalItems}
          orderType={orderType}
          setOrderType={setOrderType}
          onDiscountChange={setDiscount}
          onGenerateOrder={handleGenerateOrder}
          onClearOrder={handleClearOrder}
          hasItems={cartItems.length > 0}
          errorMessage={errorMessage}
        />
      </div>
    </div>
  );
}
