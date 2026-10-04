import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard,
  Receipt, 
  UtensilsCrossed, 
  History, 
  PlusCircle, 
  Volume2, 
  VolumeX,
  Sparkles
} from 'lucide-react';
import { formatDateTime } from '../utils/formatters';
import { sound } from '../utils/sound';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onNewBillClick 
}) {
  const [timeState, setTimeState] = useState(formatDateTime());
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeState(formatDateTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleSound = () => {
    sound.muted = !sound.muted;
    setIsMuted(sound.muted);
  };

  return (
    <header className="pos-header no-print">
      <div className="pos-header-inner">
        {/* Brand */}
        <div 
          className="brand-section"
          onClick={() => {
            sound.playTap();
            setActiveTab('dashboard');
          }}
          style={{ cursor: 'pointer' }}
          title="Tiffin Billing POS"
        >
          <div className="brand-icon-box">
            🍱
          </div>
          <div>
            <div className="brand-title">
              TIFFIN BILLING
              <span className="brand-tag">POS</span>
            </div>
            <div className="brand-tagline">
              Fast Billing • Simple KOT • Easy Management
            </div>
          </div>
        </div>

        {/* Live Clock with pulsating green status indicator */}
        <div className="header-clock" title="Live Clock • POS Online">
          <div className="status-dot-pulse" title="System Online & Ready" />
          <span style={{ fontWeight: 600 }}>{timeState.date}</span>
          <span style={{ opacity: 0.35 }}>|</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--text-main)' }}>
            {timeState.time}
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="header-nav">
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => {
              sound.playTap();
              setActiveTab('dashboard');
            }}
          >
            <LayoutDashboard size={17} />
            <span>🍽 Dashboard</span>
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'billing' ? 'active' : ''}`}
            onClick={() => {
              sound.playTap();
              setActiveTab('billing');
            }}
          >
            <Receipt size={17} />
            <span>🧾 New Bill</span>
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
            onClick={() => {
              sound.playTap();
              setActiveTab('manage');
            }}
          >
            <UtensilsCrossed size={17} />
            <span>🍴 Manage Tiffins</span>
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => {
              sound.playTap();
              setActiveTab('history');
            }}
          >
            <History size={17} />
            <span>📋 Bill History</span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            className="nav-tab-btn audio-toggle-btn"
            onClick={toggleSound}
            title={isMuted ? 'Sound Muted (Click to Unmute)' : 'Audio Feedback Active (Click to Mute)'}
          >
            {isMuted ? <VolumeX size={18} color="#94a3b8" /> : <Volume2 size={18} color="#ea580c" />}
          </button>

          {/* Large + NEW BILL action button */}
          <button
            type="button"
            className="btn-primary-action btn-header-new-bill"
            onClick={() => {
              sound.playTap();
              if (activeTab !== 'billing') setActiveTab('billing');
              if (onNewBillClick) onNewBillClick();
            }}
            title="Start a fresh new bill"
          >
            <PlusCircle size={18} />
            <span>+ NEW BILL</span>
          </button>
        </div>
      </div>
    </header>
  );
}
