import React from 'react';
import { Plus, Minus, Check } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function TiffinCard({ 
  tiffin, 
  onAddToCart, 
  onUpdateQty,
  quantityInCart = 0 
}) {
  const isAvailable = tiffin.available !== false;

  const handleClick = (e) => {
    e.stopPropagation();
    if (isAvailable) {
      onAddToCart(tiffin);
    }
  };

  const handleMinus = (e) => {
    e.stopPropagation();
    if (onUpdateQty && quantityInCart > 0) {
      onUpdateQty(tiffin.id, quantityInCart - 1);
    }
  };

  const handlePlus = (e) => {
    e.stopPropagation();
    if (onAddToCart && isAvailable) {
      onAddToCart(tiffin);
    }
  };

  return (
    <div 
      className={`tiffin-card ${quantityInCart > 0 ? 'in-cart' : ''} ${!isAvailable ? 'unavailable' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={isAvailable ? 0 : -1}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e);
        }
      }}
      title={isAvailable ? `Add ${tiffin.name} (₹${tiffin.price}) to bill` : `${tiffin.name} is currently unavailable`}
    >
      {/* Top Header with Category Badge & Veg Indicator */}
      <div className="tiffin-badge-box">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="tiffin-emoji-box" title={tiffin.category || 'Tiffin'}>
            {tiffin.icon || '🍱'}
          </div>
          <div className="veg-badge" title="100% Pure Veg Tiffin">
            <div className="veg-badge-dot" />
          </div>
        </div>

        {/* Availability Badge */}
        {isAvailable ? (
          <span className="availability-badge available">
            Available
          </span>
        ) : (
          <span className="availability-badge unavailable">
            Unavailable
          </span>
        )}
      </div>

      {/* Main Info */}
      <div className="tiffin-card-body">
        <div className="tiffin-card-title">{tiffin.name}</div>
        <div className="tiffin-card-cat">{tiffin.category || 'Tiffins'}</div>
        {tiffin.description && (
          <div className="tiffin-card-desc">{tiffin.description}</div>
        )}
      </div>

      {/* Footer: Price & Add / Mini Stepper */}
      <div className="tiffin-card-footer">
        <div className="tiffin-card-price">
          ₹{tiffin.price}
        </div>

        {quantityInCart > 0 && isAvailable ? (
          <div className="card-mini-stepper" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="card-mini-btn minus"
              onClick={handleMinus}
              title="Decrease quantity"
            >
              <Minus size={13} strokeWidth={3} />
            </button>
            <span className="card-mini-qty">
              {quantityInCart}
            </span>
            <button
              type="button"
              className="card-mini-btn plus"
              onClick={handlePlus}
              title="Increase quantity"
            >
              <Plus size={13} strokeWidth={3} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="tiffin-card-add-btn"
            disabled={!isAvailable}
            onClick={handleClick}
            title={isAvailable ? `Add ${tiffin.name}` : 'Item is unavailable'}
          >
            <Plus size={18} strokeWidth={3} />
            <span className="add-btn-text">ADD</span>
          </button>
        )}
      </div>
    </div>
  );
}
