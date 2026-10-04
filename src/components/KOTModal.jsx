import React, { useState } from 'react';
import { Printer, Check, X, PlusCircle, Receipt, Utensils } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import { sound } from '../utils/sound';

export default function KOTModal({ 
  bill, 
  onClose, 
  initialView = 'kot' // 'kot' or 'bill'
}) {
  const [viewMode, setViewMode] = useState(initialView);

  if (!bill) return null;

  const dt = formatDateTime(bill.timestamp);
  const totalItemsCount = bill.totalItems || bill.items.reduce((s, i) => s + i.quantity, 0);

  const handlePrint = () => {
    sound.playTap();
    window.print();
  };

  const handleNewBill = () => {
    sound.playTap();
    onClose();
  };

  return (
    <div className="modal-overlay print-active-modal" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div 
              style={{
                width: 36, 
                height: 36, 
                borderRadius: '10px', 
                backgroundColor: 'var(--green-100)', 
                color: 'var(--green-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Check size={20} strokeWidth={3} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-main)' }}>
                KOT Generated Successfully!
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Token: <strong style={{ color: 'var(--primary-700)' }}>{bill.kotNumber}</strong> • {dt.time}
              </div>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose} 
            className="cart-row-delete-btn"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* View Switcher Tabs (KOT Slip vs Detailed Bill) */}
        <div className="no-print" style={{ padding: '0.75rem 1.5rem 0', display: 'flex', gap: '0.6rem' }}>
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setViewMode('kot');
            }}
            className={`btn-secondary-action ${viewMode === 'kot' ? 'active' : ''}`}
            style={{
              flex: 1,
              backgroundColor: viewMode === 'kot' ? 'var(--primary-600)' : 'var(--bg-app)',
              borderColor: viewMode === 'kot' ? 'var(--primary-700)' : 'var(--border-light)',
              color: viewMode === 'kot' ? 'white' : 'var(--text-main)',
              fontWeight: 800,
              padding: '0.55rem'
            }}
          >
            <Utensils size={15} />
            <span>KOT TOKEN & ITEMS</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setViewMode('bill');
            }}
            className={`btn-secondary-action ${viewMode === 'bill' ? 'active' : ''}`}
            style={{
              flex: 1,
              backgroundColor: viewMode === 'bill' ? 'var(--primary-600)' : 'var(--bg-app)',
              borderColor: viewMode === 'bill' ? 'var(--primary-700)' : 'var(--border-light)',
              color: viewMode === 'bill' ? 'white' : 'var(--text-main)',
              fontWeight: 800,
              padding: '0.55rem'
            }}
          >
            <Receipt size={15} />
            <span>CUSTOMER BILL</span>
          </button>
        </div>

        {/* Modal Body / Thermal Receipt Paper */}
        <div className="modal-body">
          <div className="receipt-paper" id="printable-receipt">
            {viewMode === 'kot' ? (
              /* ================= EXACT KOT TOKEN + TAKEN ITEMS + TOTAL BILL ================= */
              <div>
                <div className="receipt-center">
                  <div className="receipt-title">TIFFIN BILLING</div>
                  <div className="receipt-subtitle">*** KOT RECEIPT ***</div>
                </div>

                <div className="receipt-double-divider" />

                <div className="receipt-row" style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                  <span>KOT TOKEN:</span>
                  <span className="receipt-large" style={{ color: '#000', fontFamily: 'var(--font-mono)' }}>
                    {bill.kotNumber}
                  </span>
                </div>
                <div className="receipt-row">
                  <span>Date: {dt.date}</span>
                  <span>Time: {dt.time}</span>
                </div>
                <div className="receipt-row">
                  <span>Order Type: <strong>{bill.orderType || 'Dine-In'}</strong></span>
                </div>

                <div className="receipt-divider" />

                {/* Items Table: ITEM | QTY | AMOUNT */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 45px 75px', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                  <span>ITEM</span>
                  <span style={{ textAlign: 'center' }}>QTY</span>
                  <span style={{ textAlign: 'right' }}>AMOUNT</span>
                </div>
                <div className="receipt-divider" />

                {bill.items.map((item, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 45px 75px', 
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      marginBottom: '0.35rem' 
                    }}
                  >
                    <span>{item.name}</span>
                    <span style={{ textAlign: 'center' }}>{item.quantity}</span>
                    <span style={{ textAlign: 'right' }}>₹{item.amount || (item.price * item.quantity)}</span>
                  </div>
                ))}

                <div className="receipt-divider" />

                <div className="receipt-row receipt-bold">
                  <span>TOTAL ITEMS:</span>
                  <span>{totalItemsCount}</span>
                </div>

                {bill.discount > 0 && (
                  <div className="receipt-row" style={{ color: '#15803d' }}>
                    <span>Discount:</span>
                    <span>- ₹{bill.discount}</span>
                  </div>
                )}

                <div className="receipt-double-divider" />

                <div className="receipt-row receipt-bold receipt-large">
                  <span>TOTAL BILL:</span>
                  <span style={{ fontSize: '1.35rem' }}>₹{bill.grandTotal}</span>
                </div>

                <div className="receipt-double-divider" />

                <div className="receipt-center" style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#52525b' }}>
                  ** Fast Tiffin Service **
                </div>
              </div>
            ) : (
              /* ================= DETAILED CUSTOMER RECEIPT ================= */
              <div>
                <div className="receipt-center">
                  <div className="receipt-title">TIFFIN BILLING</div>
                  <div style={{ fontSize: '0.82rem', color: '#3f3f46', fontWeight: 600 }}>Authentic & Fresh Hot Tiffins</div>
                  <div style={{ fontSize: '0.78rem', color: '#71717a' }}>Main Road, Near Bus Stand</div>
                </div>

                <div className="receipt-double-divider" />

                <div className="receipt-row">
                  <span className="receipt-bold">KOT TOKEN: {bill.kotNumber}</span>
                  <span style={{ fontWeight: 700 }}>{bill.orderType || 'Dine-In'}</span>
                </div>
                <div className="receipt-row">
                  <span>Date: {dt.date}</span>
                  <span>Time: {dt.time}</span>
                </div>

                <div className="receipt-divider" />

                {/* Items Table */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 36px 55px 65px', fontWeight: 800, fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                  <span>ITEM</span>
                  <span style={{ textAlign: 'center' }}>QTY</span>
                  <span style={{ textAlign: 'right' }}>PRICE</span>
                  <span style={{ textAlign: 'right' }}>AMOUNT</span>
                </div>
                <div className="receipt-divider" />

                {bill.items.map((item, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 36px 55px 65px', 
                      fontSize: '0.88rem',
                      marginBottom: '0.3rem' 
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{item.name}</span>
                    <span style={{ textAlign: 'center', fontWeight: 700 }}>{item.quantity}</span>
                    <span style={{ textAlign: 'right' }}>₹{item.price}</span>
                    <span style={{ textAlign: 'right', fontWeight: 800 }}>₹{item.amount || (item.price * item.quantity)}</span>
                  </div>
                ))}

                <div className="receipt-divider" />

                <div className="receipt-row">
                  <span>Total Items:</span>
                  <span className="receipt-bold">{totalItemsCount}</span>
                </div>

                <div className="receipt-row">
                  <span>Subtotal:</span>
                  <span className="receipt-bold">₹{bill.subtotal}</span>
                </div>

                {bill.discount > 0 && (
                  <div className="receipt-row" style={{ color: '#15803d' }}>
                    <span>Discount:</span>
                    <span className="receipt-bold">- ₹{bill.discount}</span>
                  </div>
                )}

                <div className="receipt-double-divider" />

                <div className="receipt-row receipt-bold receipt-large">
                  <span>TOTAL BILL:</span>
                  <span style={{ fontSize: '1.3rem' }}>₹{bill.grandTotal}</span>
                </div>

                <div className="receipt-double-divider" />

                <div className="receipt-center" style={{ marginTop: '0.85rem', fontSize: '0.82rem', color: '#27272a', fontWeight: 600 }}>
                  Thank you! Visit again 😊
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer with [ PRINT KOT ] and [ NEW BILL ] Buttons */}
        <div className="modal-footer no-print">
          <button
            type="button"
            className="btn-secondary-action"
            onClick={handleNewBill}
            style={{ padding: '0.65rem 1.25rem', fontWeight: 800 }}
          >
            <PlusCircle size={16} />
            <span>NEW BILL</span>
          </button>

          <button
            type="button"
            className="btn-primary-action"
            onClick={handlePrint}
            style={{ padding: '0.65rem 1.35rem', fontWeight: 800 }}
          >
            <Printer size={17} />
            <span>PRINT KOT</span>
          </button>
        </div>
      </div>
    </div>
  );
}
