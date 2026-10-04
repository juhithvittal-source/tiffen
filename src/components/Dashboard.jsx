import React from 'react';
import { 
  PlusCircle, 
  ReceiptText, 
  IndianRupee, 
  ShoppingBag, 
  TicketCheck, 
  ArrowRight, 
  UtensilsCrossed, 
  History,
  TrendingUp,
  Receipt,
  ChefHat,
  Sparkles
} from 'lucide-react';
import { formatCurrency, formatDateTime, isToday } from '../utils/formatters';
import { sound } from '../utils/sound';

export default function Dashboard({
  bills = [],
  menu = [],
  onNewBillClick,
  onOpenManageMenu,
  onOpenHistory,
  onViewBill
}) {
  // Calculate today's figures
  const todayBills = bills.filter(b => isToday(b.timestamp));
  const todayBillsCount = todayBills.length;
  const todaySales = todayBills.reduce((sum, b) => sum + (Number(b.grandTotal) || 0), 0);
  const todayItemsSold = todayBills.reduce((sum, b) => {
    if (b.totalItems) return sum + Number(b.totalItems);
    if (b.items) {
      return sum + b.items.reduce((iSum, item) => iSum + (Number(item.quantity) || 0), 0);
    }
    return sum;
  }, 0);

  const latestBill = bills[0];
  const latestKOT = latestBill ? latestBill.kotNumber : 'KOT-000';

  // Calculate top sold items
  const itemCounts = {};
  todayBills.forEach(b => {
    if (b.items) {
      b.items.forEach(it => {
        itemCounts[it.name] = (itemCounts[it.name] || 0) + Number(it.quantity);
      });
    }
  });

  const popularItems = Object.entries(itemCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="dashboard-container">
      {/* Hero Welcome & Quick Start Banner */}
      <div className="dashboard-hero-banner">
        <div>
          <div className="dashboard-badge">
            <Sparkles size={14} />
            <span>Fast Billing & KOT POS</span>
          </div>
          <h1 className="dashboard-hero-title">TIFFIN BILLING</h1>
          <p className="dashboard-hero-subtitle">
            Fast Billing • Simple KOT • Easy Management
          </p>
        </div>

        <div className="dashboard-hero-actions">
          <button
            type="button"
            className="btn-hero-new-bill"
            onClick={() => {
              sound.playTap();
              onNewBillClick();
            }}
          >
            <PlusCircle size={22} />
            <span>+ NEW BILL</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="summary-cards-grid">
        {/* Today's Bills */}
        <div className="summary-card bills">
          <div className="summary-card-info">
            <h4>Today's Bills</h4>
            <div className="value">{todayBillsCount}</div>
            <div className="summary-subtext">Completed orders</div>
          </div>
          <div className="summary-card-icon">
            <ReceiptText size={26} />
          </div>
        </div>

        {/* Today's Sales */}
        <div className="summary-card sales">
          <div className="summary-card-info">
            <h4>Today's Sales</h4>
            <div className="value" style={{ color: '#059669' }}>
              {formatCurrency(todaySales)}
            </div>
            <div className="summary-subtext">Total collection</div>
          </div>
          <div className="summary-card-icon">
            <IndianRupee size={26} />
          </div>
        </div>

        {/* Items Sold */}
        <div className="summary-card items">
          <div className="summary-card-info">
            <h4>Items Sold</h4>
            <div className="value" style={{ color: '#2563eb' }}>
              {todayItemsSold}
            </div>
            <div className="summary-subtext">Tiffins served</div>
          </div>
          <div className="summary-card-icon">
            <ShoppingBag size={26} />
          </div>
        </div>

        {/* Latest KOT */}
        <div className="summary-card kot">
          <div className="summary-card-info">
            <h4>Latest KOT</h4>
            <div className="value" style={{ fontFamily: 'var(--font-mono)', color: 'var(--amber-600)' }}>
              {latestKOT}
            </div>
            <div className="summary-subtext">Active token count</div>
          </div>
          <div className="summary-card-icon">
            <TicketCheck size={26} />
          </div>
        </div>
      </div>

      {/* Dashboard 2-Column Split: Recent Orders & Quick Management */}
      <div className="dashboard-grid-split">
        {/* Left: Recent Completed Orders with Live Print/View */}
        <div className="dashboard-card recent-orders-card">
          <div className="dashboard-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Receipt size={20} color="var(--primary-600)" />
              <h3 style={{ fontSize: '1.15rem' }}>Recent Orders Today</h3>
            </div>

            <button
              type="button"
              className="link-button"
              onClick={onOpenHistory}
            >
              <span>View All History</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="recent-orders-list">
            {todayBills.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧾</div>
                <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>No orders billed yet today</div>
                <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  Click <strong>+ NEW BILL</strong> to start serving your first customer!
                </p>
              </div>
            ) : (
              todayBills.slice(0, 6).map((b) => {
                const dt = formatDateTime(b.timestamp);
                const itemsCount = b.totalItems || (b.items ? b.items.reduce((s, i) => s + i.quantity, 0) : 0);
                return (
                  <div key={b.id || b.kotNumber} className="recent-order-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div className="recent-order-kot-pill">
                        {b.kotNumber}
                      </div>

                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                          {b.items?.map(it => `${it.name} (${it.quantity})`).join(', ') || 'Tiffins'}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {dt.time} • {itemsCount} items • <span style={{ fontWeight: 700, color: b.orderType === 'Takeaway' ? '#2563eb' : '#16a34a' }}>{b.orderType || 'Dine-In'}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{ fontWeight: 800, fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--text-main)' }}>
                        {formatCurrency(b.grandTotal)}
                      </div>

                      <button
                        type="button"
                        className="btn-secondary-action"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem' }}
                        onClick={() => onViewBill(b)}
                        title="View KOT and Customer Bill"
                      >
                        <ChefHat size={14} />
                        <span>View Bills</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Quick Shortcuts & Popular Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Quick Actions Card */}
          <div className="dashboard-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.85rem' }}>Quick Shortcuts</h3>
            <div className="quick-actions-grid">
              <button
                type="button"
                className="quick-action-tile primary"
                onClick={onNewBillClick}
              >
                <div className="quick-tile-icon">🧾</div>
                <div className="quick-tile-title">Start New Bill</div>
                <div className="quick-tile-desc">Open POS billing screen</div>
              </button>

              <button
                type="button"
                className="quick-action-tile"
                onClick={onOpenManageMenu}
              >
                <div className="quick-tile-icon">🍴</div>
                <div className="quick-tile-title">Manage Tiffins</div>
                <div className="quick-tile-desc">{menu.length} items on menu</div>
              </button>

              <button
                type="button"
                className="quick-action-tile"
                onClick={onOpenHistory}
              >
                <div className="quick-tile-icon">📋</div>
                <div className="quick-tile-title">Bill History</div>
                <div className="quick-tile-desc">{bills.length} total orders recorded</div>
              </button>
            </div>
          </div>

          {/* Popular Items Card */}
          <div className="dashboard-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <TrendingUp size={18} color="var(--primary-600)" />
              <h3 style={{ fontSize: '1.1rem' }}>Top Selling Today</h3>
            </div>

            {popularItems.length === 0 ? (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
                No item sales recorded today yet.
              </div>
            ) : (
              <div className="popular-items-list">
                {popularItems.map((item, idx) => (
                  <div key={idx} className="popular-item-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span className="rank-num">#{idx + 1}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{item.name}</span>
                    </div>
                    <span className="badge-pill" style={{ background: 'var(--primary-50)', color: 'var(--primary-800)', fontWeight: 800 }}>
                      {item.count} sold
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
