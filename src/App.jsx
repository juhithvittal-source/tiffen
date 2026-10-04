import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import BillingScreen from './components/BillingScreen';
import ManageTiffins from './components/ManageTiffins';
import BillHistory from './components/BillHistory';
import OrderReceiptModal from './components/OrderReceiptModal';
import { Storage } from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState('billing');
  const [menu, setMenu] = useState([]);
  const [bills, setBills] = useState([]);
  const [kotNumber, setKotNumber] = useState(1);
  const [activeModalBill, setActiveModalBill] = useState(null); // Bill object to display in dual modal

  // Load from LocalStorage on mount
  useEffect(() => {
    const loadedMenu = Storage.getMenu();
    const loadedBills = Storage.getBills();
    const currentKot = Storage.getNextKOTNumber();
    
    setMenu(loadedMenu);
    setBills(loadedBills);
    setKotNumber(currentKot);
  }, []);

  // Handler when a new bill/order is generated
  const handleGenerateOrder = (newBill) => {
    // 1. Add bill to storage
    const updatedBills = Storage.addBill(newBill);
    setBills(updatedBills);

    // 2. Increment KOT counter
    const nextKOT = Storage.incrementKOTNumber();
    setKotNumber(nextKOT);

    // 3. Trigger confetti celebration
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#ea580c', '#f59e0b', '#16a34a', '#dc2626']
      });
    } catch {
      // ignore if canvas not supported
    }

    // 4. Open Dual Bill receipt modal (KOT Bill + Customer Bill)
    setActiveModalBill(newBill);
  };

  // Handler when menu is edited/added/deleted
  const handleSaveMenu = (updatedMenu) => {
    Storage.saveMenu(updatedMenu);
    setMenu(updatedMenu);
  };

  // Reset menu to defaults
  const handleResetDefaultMenu = () => {
    const result = Storage.resetToDefaults();
    setMenu(result.menu);
    setBills(result.bills);
    setKotNumber(result.kotCounter);
  };

  return (
    <div className="app-container">
      {/* Top POS Header / Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewBillClick={() => {
          setActiveTab('billing');
        }}
      />

      <main className="main-content">
        {/* Tab 1: 🍽 Dashboard */}
        {activeTab === 'dashboard' && (
          <Dashboard
            bills={bills}
            menu={menu}
            onNewBillClick={() => setActiveTab('billing')}
            onOpenManageMenu={() => setActiveTab('manage')}
            onOpenHistory={() => setActiveTab('history')}
            onViewBill={(bill) => setActiveModalBill(bill)}
          />
        )}

        {/* Tab 2: 🧾 New Bill / Billing POS */}
        {activeTab === 'billing' && (
          <BillingScreen
            menu={menu}
            kotNumber={kotNumber}
            onGenerateOrder={handleGenerateOrder}
            onOpenManageMenu={() => setActiveTab('manage')}
          />
        )}

        {/* Tab 3: 🍴 Manage Tiffins */}
        {activeTab === 'manage' && (
          <ManageTiffins
            menu={menu}
            onSaveMenu={handleSaveMenu}
            onResetDefaultMenu={handleResetDefaultMenu}
          />
        )}

        {/* Tab 4: 📋 Bill History */}
        {activeTab === 'history' && (
          <BillHistory bills={bills} />
        )}
      </main>

      {/* Dual Bill Printable Receipt Modal (KOT Bill + Customer Bill) */}
      {activeModalBill && (
        <OrderReceiptModal
          bill={activeModalBill}
          onClose={() => setActiveModalBill(null)}
          onNewBill={() => {
            setActiveModalBill(null);
            setActiveTab('billing');
          }}
        />
      )}
    </div>
  );
}
