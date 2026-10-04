import React from 'react';
import { 
  Sparkles,
  Trash2, 
  Utensils, 
  Package,
  AlertCircle 
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function BillSummary({
  subtotal = 0,
  discount = 0,
  grandTotal = 0,
  totalItems = 0,
  orderType = 'Dine-In',
  setOrderType,
  onDiscountChange,
  onGenerateOrder,
  onClearOrder,
  hasItems = false,
  errorMessage = ''
}) {
  const discountQuickPresets = [0, 10, 20, 50];

  return (
    <div className="bill-summary-wrapper">
      {/* Order Type Selector */}
      <div className="order-type-toggle-group">
        <button
          type="button"
          onClick={() => setOrderType('Dine-In')}
          className={`btn-order-type ${orderType === 'Dine-In' ? 'active' : ''}`}
        >
          <Utensils size={15} />
          <span>Dine-In</span>
        </button>

        <button
          type="button"
          onClick={() => setOrderType('Takeaway')}
          className={`btn-order-type ${orderType === 'Takeaway' ? 'active' : ''}`}
        >
          <Package size={15} />
          <span>Takeaway</span>
        </button>
      </div>

      {/* Summary Box with Explicit Breakdown */}
      <div className="cart-summary-box">
        <div className="summary-line">
          <span className="summary-line-label">Total Items:</span>
          <span className="summary-line-val" style={{ fontWeight: 800 }}>
            {totalItems}
          </span>
        </div>

        <div className="summary-line">
          <span className="summary-line-label">Subtotal:</span>
          <span className="summary-line-val" style={{ fontWeight: 800, fontSize: '1.05rem' }}>
            ₹{subtotal}
          </span>
        </div>

        {/* Discount Row */}
        <div className="summary-line discount-input-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            <span className="summary-line-label">Discount:</span>
            <div className="discount-preset-pills">
              {discountQuickPresets.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => onDiscountChange(Math.min(val, subtotal))}
                  className={`discount-pill ${discount === val ? 'active' : ''}`}
                  disabled={subtotal === 0}
                >
                  {val === 0 ? '₹0' : `₹${val}`}
                </button>
              ))}
            </div>
          </div>

          <div className="discount-input-group">
            <span className="discount-currency-symbol">₹</span>
            <input
              type="number"
              min="0"
              max={subtotal}
              value={discount === 0 ? '' : discount}
              placeholder="0"
              disabled={subtotal === 0}
              onChange={(e) => {
                const val = Math.max(0, Number(e.target.value) || 0);
                onDiscountChange(Math.min(val, subtotal));
              }}
              className="discount-input"
            />
          </div>
        </div>

        {/* GRAND TOTAL */}
        <div className="grand-total-row">
          <span className="grand-total-label">TOTAL BILL:</span>
          <span className="grand-total-val">₹{grandTotal}</span>
        </div>
      </div>

      {/* Inline Error Message */}
      {errorMessage && (
        <div className="cart-error-banner">
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Actions */}
      <div className="cart-actions">
        {/* Large GENERATE ORDER Button */}
        <button
          type="button"
          className="btn-generate-order"
          onClick={onGenerateOrder}
          title={hasItems ? 'Generate Order & Bills (Ctrl+Enter)' : 'Add tiffins to generate order'}
        >
          <Sparkles size={20} />
          <span>GENERATE ORDER</span>
        </button>

        {hasItems && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.4rem' }}>
            <button
              type="button"
              className="link-button-danger"
              onClick={onClearOrder}
              title="Clear all items from current bill"
            >
              <Trash2 size={13} />
              <span>Clear Order</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
