import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { sound } from '../utils/sound';

export default function ConfirmDialog({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel} style={{ zIndex: 110 }}>
      <div 
        className="modal-card" 
        style={{ maxWidth: '420px' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div 
              style={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: isDestructive ? '#fee2e2' : 'var(--primary-100)',
                color: isDestructive ? '#dc2626' : 'var(--primary-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AlertTriangle size={18} />
            </div>
            <h3 style={{ fontSize: '1.1rem' }}>{title}</h3>
          </div>
          <button type="button" onClick={onCancel} className="cart-row-delete-btn">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          {message}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-secondary-action"
            onClick={() => {
              sound.playTap();
              onCancel();
            }}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className="btn-primary-action"
            style={{
              background: isDestructive ? 'linear-gradient(135deg, #ef4444, #dc2626)' : undefined,
              boxShadow: isDestructive ? '0 4px 12px rgba(220, 38, 38, 0.3)' : undefined
            }}
            onClick={() => {
              if (isDestructive) sound.playDelete();
              else sound.playTap();
              onConfirm();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
