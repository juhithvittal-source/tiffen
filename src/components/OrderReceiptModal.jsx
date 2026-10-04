import React, { useState } from 'react';
import { Printer, Check, X, PlusCircle, ChefHat, Receipt, Layers, Sparkles } from 'lucide-react';
import KOTBill from './KOTBill';
import CustomerBill from './CustomerBill';
import { sound } from '../utils/sound';

export default function OrderReceiptModal({
  bill,
  onClose,
  onNewBill
}) {
  const [printTarget, setPrintTarget] = useState('both'); // 'kot', 'customer', or 'both'
  const [activeTabMobile, setActiveTabMobile] = useState('all'); // 'all', 'kot', 'customer' for small screens

  if (!bill) return null;

  const triggerPrint = (target) => {
    sound.playTap();
    setPrintTarget(target);
    
    // Set class on document body for instant print media query selector
    document.body.setAttribute('data-print-target', target);

    // Short timeout to guarantee DOM attribute is applied before print dialog opens
    setTimeout(() => {
      window.print();
      // Clean up body attribute after print
      setTimeout(() => {
        document.body.removeAttribute('data-print-target');
      }, 500);
    }, 50);
  };

  const handleStartNewBill = () => {
    sound.playTap();
    if (onNewBill) {
      onNewBill();
    } else {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-card modal-card-wide" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '880px', width: '95%' }}
      >
        {/* Modal Header */}
        <div className="modal-header no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div 
              style={{
                width: 40, 
                height: 40, 
                borderRadius: '12px', 
                backgroundColor: 'var(--green-100)', 
                color: 'var(--green-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(22, 163, 74, 0.2)'
              }}
            >
              <Check size={22} strokeWidth={3} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Order Generated!</span>
                <span className="badge-pill" style={{ background: 'var(--primary-100)', color: 'var(--primary-800)', fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                  {bill.kotNumber}
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Both <strong>KOT Bill</strong> and <strong>Customer Bill</strong> have been generated for the same order.
              </div>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose} 
            className="cart-row-delete-btn"
            title="Close"
          >
            <X size={22} />
          </button>
        </div>

        {/* Action Bar (Top Shortcuts) */}
        <div className="receipt-modal-actions-bar no-print">
          <div className="print-actions-group">
            <button
              type="button"
              className="btn-print-kot"
              onClick={() => triggerPrint('kot')}
              title="Print ONLY KOT for Kitchen"
            >
              <Printer size={16} />
              <span>PRINT KOT</span>
            </button>

            <button
              type="button"
              className="btn-print-customer"
              onClick={() => triggerPrint('customer')}
              title="Print ONLY Customer Bill"
            >
              <Printer size={16} />
              <span>PRINT CUSTOMER BILL</span>
            </button>

            <button
              type="button"
              className="btn-print-both"
              onClick={() => triggerPrint('both')}
              title="Print BOTH bills in 1 action with page break"
            >
              <Layers size={16} />
              <span>PRINT BOTH</span>
            </button>
          </div>

          <button
            type="button"
            className="btn-modal-new-bill"
            onClick={handleStartNewBill}
            title="Clear cart and start next order"
          >
            <PlusCircle size={16} />
            <span>+ NEW BILL</span>
          </button>
        </div>

        {/* Mobile View Tab Switcher */}
        <div className="mobile-receipt-tabs no-print">
          <button 
            type="button"
            className={`mobile-tab-btn ${activeTabMobile === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTabMobile('all')}
          >
            Both Bills
          </button>
          <button 
            type="button"
            className={`mobile-tab-btn ${activeTabMobile === 'kot' ? 'active' : ''}`}
            onClick={() => setActiveTabMobile('kot')}
          >
            KOT Bill
          </button>
          <button 
            type="button"
            className={`mobile-tab-btn ${activeTabMobile === 'customer' ? 'active' : ''}`}
            onClick={() => setActiveTabMobile('customer')}
          >
            Customer Bill
          </button>
        </div>

        {/* Modal Body: Side-by-Side Dual Bills Display */}
        <div className="modal-body receipts-dual-container">
          {/* Bill 1: KOT Bill (Kitchen Ticket) */}
          <div className={`receipt-col-wrapper ${(activeTabMobile === 'customer') ? 'hide-on-mobile' : ''}`}>
            <div className="receipt-col-header no-print">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <ChefHat size={18} color="var(--primary-600)" />
                <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>BILL 1 — KOT BILL</span>
              </div>
              <span className="receipt-role-tag kitchen">Kitchen / Prep</span>
            </div>

            <div className="receipt-paper-holder">
              <KOTBill bill={bill} />
            </div>

            <div className="receipt-single-print-btn-box no-print">
              <button
                type="button"
                className="btn-secondary-action"
                style={{ width: '100%', fontWeight: 800, borderColor: 'var(--primary-300)', color: 'var(--primary-800)', background: 'var(--primary-50)' }}
                onClick={() => triggerPrint('kot')}
              >
                <Printer size={15} />
                <span>PRINT KOT</span>
              </button>
            </div>
          </div>

          {/* Bill 2: Customer Bill (Price & Total) */}
          <div className={`receipt-col-wrapper ${(activeTabMobile === 'kot') ? 'hide-on-mobile' : ''}`}>
            <div className="receipt-col-header no-print">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Receipt size={18} color="var(--green-600)" />
                <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>BILL 2 — CUSTOMER BILL</span>
              </div>
              <span className="receipt-role-tag customer">Customer Copy</span>
            </div>

            <div className="receipt-paper-holder">
              <CustomerBill bill={bill} />
            </div>

            <div className="receipt-single-print-btn-box no-print">
              <button
                type="button"
                className="btn-secondary-action"
                style={{ width: '100%', fontWeight: 800, borderColor: 'var(--green-300)', color: 'var(--green-800)', background: 'var(--green-50)' }}
                onClick={() => triggerPrint('customer')}
              >
                <Printer size={15} />
                <span>PRINT CUSTOMER BILL</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer no-print" style={{ justifyContent: 'space-between' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Order Token: <strong style={{ color: 'var(--primary-800)', fontFamily: 'var(--font-mono)' }}>{bill.kotNumber}</strong> • Total: <strong style={{ color: 'var(--text-main)' }}>₹{bill.grandTotal}</strong>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button
              type="button"
              className="btn-secondary-action"
              onClick={onClose}
              style={{ fontWeight: 700 }}
            >
              Close
            </button>

            <button
              type="button"
              className="btn-primary-action"
              onClick={handleStartNewBill}
              style={{ fontWeight: 800 }}
            >
              <PlusCircle size={16} />
              <span>+ New Bill</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dedicated Invisible Print Container for window.print() */}
      <div id="print-zone" className={`print-zone print-mode-${printTarget}`}>
        <div className="print-section-kot">
          <KOTBill bill={bill} id="print-kot-target" />
        </div>
        
        <div className="print-page-break" />

        <div className="print-section-customer">
          <CustomerBill bill={bill} id="print-customer-target" />
        </div>
      </div>
    </div>
  );
}
