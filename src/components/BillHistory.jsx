import React, { useState } from 'react';
import { 
  Search, 
  Eye, 
  Printer, 
  Calendar, 
  Receipt, 
  ChefHat, 
  FileSpreadsheet,
  Layers,
  X
} from 'lucide-react';
import { formatCurrency, formatDateTime, isToday } from '../utils/formatters';
import { sound } from '../utils/sound';
import OrderReceiptModal from './OrderReceiptModal';

export default function BillHistory({ bills = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'custom'
  const [customDate, setCustomDate] = useState('');
  
  // Modal for viewing / reprinting
  const [selectedBill, setSelectedBill] = useState(null);

  // Filter bills
  const filteredBills = bills.filter((bill) => {
    const kotMatch = bill.kotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bill.items && bill.items.some(it => it.name.toLowerCase().includes(searchTerm.toLowerCase())));

    if (!kotMatch) return false;

    if (dateFilter === 'today') {
      return isToday(bill.timestamp);
    }
    if (dateFilter === 'custom' && customDate) {
      const dt = formatDateTime(bill.timestamp);
      // matching DD-MM-YYYY or YYYY-MM-DD
      const [year, month, day] = customDate.split('-');
      const formattedInputDate = `${day}-${month}-${year}`;
      return dt.date === formattedInputDate || dt.isoDate === customDate;
    }

    return true;
  });

  // Calculate stats for current view
  const totalSalesInView = filteredBills.reduce((s, b) => s + (Number(b.grandTotal) || 0), 0);
  const totalBillsInView = filteredBills.length;
  const totalItemsInView = filteredBills.reduce((s, b) => {
    if (b.totalItems) return s + Number(b.totalItems);
    if (b.items) return s + b.items.reduce((is, i) => is + Number(i.quantity), 0);
    return s;
  }, 0);

  // Today specific
  const todayBills = bills.filter(b => isToday(b.timestamp));
  const todayTotalSales = todayBills.reduce((s, b) => s + (Number(b.grandTotal) || 0), 0);

  const handleOpenReceipt = (bill) => {
    sound.playTap();
    setSelectedBill(bill);
  };

  const exportCSV = () => {
    sound.playTap();
    const headers = ['KOT No', 'Date', 'Time', 'Order Type', 'Items', 'Total Items', 'Subtotal (INR)', 'Discount (INR)', 'Grand Total (INR)'];
    const rows = filteredBills.map(b => {
      const dt = formatDateTime(b.timestamp);
      const itemsStr = b.items.map(i => `${i.name} x${i.quantity} (@Rs.${i.price})`).join('; ');
      return [
        b.kotNumber,
        dt.date,
        dt.time,
        b.orderType || 'Dine-In',
        `"${itemsStr}"`,
        b.totalItems || b.items.reduce((s, i) => s + i.quantity, 0),
        b.subtotal,
        b.discount || 0,
        b.grandTotal
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tiffin_billing_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bill-history-container">
      {/* Top Banner with Today's Sales */}
      <div className="history-summary-banner">
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-800)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Today's Total Business
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary-900)', fontFamily: 'var(--font-heading)' }}>
            ₹{todayTotalSales}
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: '0.75rem' }}>
              ({todayBills.length} orders today)
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn-secondary-action"
            onClick={exportCSV}
            title="Download report as CSV spreadsheet"
          >
            <FileSpreadsheet size={16} color="#059669" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="menu-panel-header" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', flex: 1 }}>
          <div className="search-input-wrapper" style={{ minWidth: '260px' }}>
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by KOT number (e.g. KOT-001) or item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="menu-search-input"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`category-pill ${dateFilter === 'all' ? 'active' : ''}`}
              onClick={() => {
                sound.playTap();
                setDateFilter('all');
              }}
            >
              All Time ({bills.length})
            </button>
            <button
              type="button"
              className={`category-pill ${dateFilter === 'today' ? 'active' : ''}`}
              onClick={() => {
                sound.playTap();
                setDateFilter('today');
              }}
            >
              Today ({todayBills.length})
            </button>

            {dateFilter === 'custom' && (
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                style={{
                  padding: '0.4rem 0.65rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--primary-500)',
                  fontSize: '0.85rem'
                }}
              />
            )}

            {dateFilter !== 'custom' && (
              <button
                type="button"
                className="category-pill"
                onClick={() => {
                  sound.playTap();
                  setDateFilter('custom');
                }}
              >
                <Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} />
                Custom Date
              </button>
            )}
          </div>
        </div>

        {/* View Statistics */}
        <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          Showing {filteredBills.length} orders • Total: <strong style={{ color: 'var(--primary-800)' }}>₹{totalSalesInView}</strong>
        </div>
      </div>

      {/* Bill History Table: | KOT No | Date | Time | Items | Total | Actions | */}
      <div className="data-table-container">
        <table className="pos-table">
          <thead>
            <tr>
              <th>KOT No</th>
              <th>Date</th>
              <th>Time</th>
              <th>Items</th>
              <th style={{ textAlign: 'right' }}>Total</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>No bills found matching criteria</div>
                  <div style={{ fontSize: '0.85rem' }}>Try searching a different KOT token or date.</div>
                </td>
              </tr>
            ) : (
              filteredBills.map((bill) => {
                const dt = formatDateTime(bill.timestamp);
                const itemsCount = bill.totalItems || bill.items.reduce((s, i) => s + i.quantity, 0);

                return (
                  <tr key={bill.id || bill.kotNumber}>
                    {/* KOT No */}
                    <td>
                      <span className="kot-table-badge">
                        {bill.kotNumber}
                      </span>
                    </td>

                    {/* Date */}
                    <td>
                      <div style={{ fontWeight: 700 }}>{dt.date}</div>
                    </td>

                    {/* Time */}
                    <td>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{dt.time}</div>
                    </td>

                    {/* Items */}
                    <td>
                      <div style={{ maxWidth: '320px' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                          {itemsCount} items
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {bill.items.map(it => `${it.name} (${it.quantity})`).join(', ')}
                        </div>
                      </div>
                    </td>

                    {/* Total */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-main)', fontSize: '1.1rem' }}>
                        ₹{bill.grandTotal}
                      </div>
                      {bill.discount > 0 && (
                        <div style={{ fontSize: '0.75rem', color: '#16a34a' }}>
                          Discount: ₹{bill.discount}
                        </div>
                      )}
                    </td>

                    {/* Actions: View button */}
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn-primary-action btn-view-bill"
                        onClick={() => handleOpenReceipt(bill)}
                        title="View KOT Bill & Customer Bill"
                      >
                        <Eye size={15} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Bill View / Print Modal (Shows BOTH KOT Bill & Customer Bill with PRINT KOT, PRINT CUSTOMER BILL, PRINT BOTH) */}
      {selectedBill && (
        <OrderReceiptModal
          bill={selectedBill}
          onClose={() => setSelectedBill(null)}
        />
      )}
    </div>
  );
}
