import React from 'react';
import { formatDateTime, formatCurrency } from '../utils/formatters';

export default function CustomerBill({ bill, id = 'customer-receipt' }) {
  if (!bill) return null;

  const dt = formatDateTime(bill.timestamp);
  const totalItemsCount = bill.totalItems || (bill.items ? bill.items.reduce((s, i) => s + (Number(i.quantity) || 0), 0) : 0);
  const subtotal = bill.subtotal !== undefined ? bill.subtotal : (bill.items ? bill.items.reduce((s, i) => s + (Number(i.amount) || (i.price * i.quantity)), 0) : 0);
  const discount = bill.discount || 0;
  const grandTotal = bill.grandTotal !== undefined ? bill.grandTotal : Math.max(0, subtotal - discount);

  return (
    <div className="receipt-paper customer-paper" id={id}>
      <div className="receipt-center">
        <div className="receipt-title">TIFFIN BILLING</div>
        <div className="receipt-customer-tag">Fast Billing • Simple KOT • Easy Management</div>
      </div>

      <div className="receipt-double-divider" />

      <div className="receipt-row receipt-bold" style={{ fontSize: '1.05rem' }}>
        <span>KOT NO:</span>
        <span className="receipt-kot-num" style={{ color: '#000' }}>{bill.kotNumber}</span>
      </div>

      <div className="receipt-row">
        <span>DATE: {dt.date}</span>
        <span>TIME: {dt.time}</span>
      </div>

      {bill.orderType && (
        <div className="receipt-row" style={{ fontSize: '0.8rem', color: '#52525b' }}>
          <span>ORDER TYPE:</span>
          <span>{bill.orderType}</span>
        </div>
      )}

      <div className="receipt-divider" />

      {/* ITEM | QTY | PRICE | AMOUNT */}
      <div className="customer-table-header">
        <span className="col-cust-item">ITEM</span>
        <span className="col-cust-qty">QTY</span>
        <span className="col-cust-price">PRICE</span>
        <span className="col-cust-amt">AMOUNT</span>
      </div>
      <div className="receipt-divider" />

      <div className="customer-items-list">
        {bill.items && bill.items.map((item, idx) => {
          const itemAmt = item.amount !== undefined ? item.amount : (item.price * item.quantity);
          return (
            <div key={idx} className="customer-item-row">
              <span className="col-cust-item item-name">{item.name}</span>
              <span className="col-cust-qty item-qty">{item.quantity}</span>
              <span className="col-cust-price item-price">₹{item.price}</span>
              <span className="col-cust-amt item-amt">₹{itemAmt}</span>
            </div>
          );
        })}
      </div>

      <div className="receipt-divider" />

      <div className="receipt-row">
        <span>TOTAL ITEMS:</span>
        <span className="receipt-bold">{totalItemsCount}</span>
      </div>

      <div className="receipt-row">
        <span>SUBTOTAL:</span>
        <span className="receipt-bold">₹{subtotal}</span>
      </div>

      <div className="receipt-row">
        <span>DISCOUNT:</span>
        <span className="receipt-bold">₹{discount}</span>
      </div>

      <div className="receipt-double-divider" />

      <div className="receipt-row receipt-bold receipt-large" style={{ fontSize: '1.25rem' }}>
        <span>TOTAL:</span>
        <span>₹{grandTotal}</span>
      </div>

      <div className="receipt-double-divider" />

      <div className="receipt-center customer-footer-note">
        Thank you! Visit again 😊
      </div>
    </div>
  );
}
