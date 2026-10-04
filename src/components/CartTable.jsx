import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function CartTable({ 
  items = [], 
  onUpdateQty, 
  onRemoveItem 
}) {
  if (items.length === 0) {
    return (
      <div className="empty-cart-view">
        <div className="empty-icon-wrap">
          🍽️
        </div>
        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
          No Items Added Yet
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Click any tiffin on the left menu to add it to the current order
        </div>
      </div>
    );
  }

  return (
    <div className="cart-items-container">
      {/* Bill Table Header: Item | Price | Qty | Amount */}
      <div className="cart-table-grid-header">
        <span className="cart-col-item">Item</span>
        <span className="cart-col-price">Price</span>
        <span className="cart-col-qty">Qty</span>
        <span className="cart-col-amt">Amount</span>
        <span className="cart-col-action"></span>
      </div>

      {/* Items Rows */}
      <div className="cart-table-rows-scroll">
        {items.map((item) => {
          const lineTotal = item.price * item.quantity;
          return (
            <div key={item.id} className="cart-table-row">
              {/* Item Name */}
              <div className="cart-col-item item-title-cell" title={item.name}>
                <span className="veg-badge-mini" title="Veg">
                  <span className="veg-badge-dot-mini" />
                </span>
                <span className="item-name-text">{item.name}</span>
              </div>

              {/* Unit Price */}
              <div className="cart-col-price item-price-cell">
                ₹{item.price}
              </div>

              {/* Qty Stepper (+, -, and cannot go below 1) */}
              <div className="cart-col-qty item-qty-cell">
                <div className="cart-qty-stepper">
                  <button
                    type="button"
                    className="qty-btn minus"
                    onClick={() => {
                      if (item.quantity > 1) {
                        onUpdateQty(item.id, item.quantity - 1);
                      } else {
                        // At quantity 1, clicking minus prompts removal
                        onRemoveItem(item.id);
                      }
                    }}
                    title={item.quantity === 1 ? `Remove ${item.name}` : "Decrease quantity"}
                  >
                    <Minus size={11} strokeWidth={3} />
                  </button>
                  
                  <span className="qty-display">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    className="qty-btn plus"
                    onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                    title="Increase quantity"
                  >
                    <Plus size={11} strokeWidth={3} />
                  </button>
                </div>
              </div>

              {/* Amount = Unit Price × Quantity */}
              <div className="cart-col-amt item-amount-cell">
                ₹{lineTotal}
              </div>

              {/* Remove button */}
              <div className="cart-col-action">
                <button
                  type="button"
                  className="cart-row-delete-btn"
                  onClick={() => onRemoveItem(item.id)}
                  title={`Remove ${item.name}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
