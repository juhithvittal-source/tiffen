import React from 'react';
import { formatDateTime } from '../utils/formatters';

export default function KOTBill({ bill, id = 'kot-ticket' }) {
  if (!bill) return null;

  const dt = formatDateTime(bill.timestamp);
  const totalItemsCount = bill.totalItems || (bill.items ? bill.items.reduce((s, i) => s + (Number(i.quantity) || 0), 0) : 0);

  return (
    <div className="receipt-paper kot-paper" id={id}>
      <div className="receipt-center">
        <div className="receipt-title">TIFFIN BILLING</div>
        <div className="receipt-kot-tag">KOT</div>
        <div className="receipt-kot-underline">===</div>
      </div>

      <div className="receipt-double-divider" />

      <div className="receipt-row receipt-kot-header-row">
        <span className="receipt-bold">KOT NO:</span>
        <span className="receipt-kot-num">{bill.kotNumber}</span>
      </div>

      <div className="receipt-row">
        <span>DATE: {dt.date}</span>
        <span>TIME: {dt.time}</span>
      </div>

      {bill.orderType && (
        <div className="receipt-row" style={{ fontSize: '0.8rem', color: '#3f3f46', marginTop: '2px' }}>
          <span>ORDER TYPE:</span>
          <span style={{ fontWeight: 700 }}>{bill.orderType.toUpperCase()}</span>
        </div>
      )}

      <div className="receipt-divider" />

      {/* ITEM and QTY Table only (strictly no price for kitchen) */}
      <div className="kot-table-header">
        <span className="kot-col-item">ITEM</span>
        <span className="kot-col-qty">QTY</span>
      </div>
      <div className="receipt-divider" />

      <div className="kot-items-list">
        {bill.items && bill.items.map((item, idx) => (
          <div key={idx} className="kot-item-row">
            <span className="kot-col-item kot-item-name">{item.name.toUpperCase()}</span>
            <span className="kot-col-qty kot-item-qty">{item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="receipt-divider" />

      <div className="receipt-row receipt-bold" style={{ fontSize: '1rem', marginTop: '4px' }}>
        <span>TOTAL ITEMS:</span>
        <span style={{ fontSize: '1.1rem' }}>{totalItemsCount}</span>
      </div>

      <div className="receipt-double-divider" />

      <div className="receipt-center kot-footer-note">
        *** KITCHEN COPY • PREPARE FAST ***
      </div>
    </div>
  );
}
