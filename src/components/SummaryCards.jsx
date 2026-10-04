import React from 'react';
import { 
  ReceiptText, 
  IndianRupee, 
  ShoppingBag, 
  TicketCheck 
} from 'lucide-react';
import { formatCurrency, isToday, formatKOTNumber } from '../utils/formatters';

export default function SummaryCards({ bills = [] }) {
  // Calculate today's statistics
  const todayBills = bills.filter(b => isToday(b.timestamp));
  
  const todayBillsCount = todayBills.length;
  
  const todaySales = todayBills.reduce((sum, b) => sum + (Number(b.grandTotal) || 0), 0);
  
  const todayItemsCount = todayBills.reduce((sum, b) => {
    if (b.totalItems) return sum + Number(b.totalItems);
    if (b.items) {
      return sum + b.items.reduce((iSum, item) => iSum + (Number(item.quantity) || 0), 0);
    }
    return sum;
  }, 0);

  // Last KOT
  const lastBill = bills[0]; // Most recent bill
  const lastKOT = lastBill ? lastBill.kotNumber : 'KOT-000';

  return (
    <div className="summary-cards-grid no-print">
      {/* Today's Bills */}
      <div className="summary-card bills">
        <div className="summary-card-info">
          <h4>Today's Bills</h4>
          <div className="value">{todayBillsCount}</div>
        </div>
        <div className="summary-card-icon">
          <ReceiptText size={24} />
        </div>
      </div>

      {/* Today's Total Sales */}
      <div className="summary-card sales">
        <div className="summary-card-info">
          <h4>Today's Total Sales</h4>
          <div className="value" style={{ color: '#059669' }}>
            {formatCurrency(todaySales)}
          </div>
        </div>
        <div className="summary-card-icon">
          <IndianRupee size={24} />
        </div>
      </div>

      {/* Total Items Sold */}
      <div className="summary-card items">
        <div className="summary-card-info">
          <h4>Total Items Sold</h4>
          <div className="value" style={{ color: '#2563eb' }}>
            {todayItemsCount}
          </div>
        </div>
        <div className="summary-card-icon">
          <ShoppingBag size={24} />
        </div>
      </div>

      {/* Last KOT Number */}
      <div className="summary-card kot">
        <div className="summary-card-info">
          <h4>Last KOT Number</h4>
          <div className="value" style={{ fontFamily: 'var(--font-mono)', color: 'var(--amber-600)' }}>
            {lastKOT}
          </div>
        </div>
        <div className="summary-card-icon">
          <TicketCheck size={24} />
        </div>
      </div>
    </div>
  );
}
