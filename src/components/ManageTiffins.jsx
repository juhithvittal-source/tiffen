import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  X,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { DEFAULT_CATEGORIES } from '../data/defaultMenu';
import { sound } from '../utils/sound';
import ConfirmDialog from './ConfirmDialog';

export default function ManageTiffins({ 
  menu = [], 
  onSaveMenu,
  onResetDefaultMenu
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null when adding new
  const [formError, setFormError] = useState('');
  
  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Tiffins',
    available: true,
    description: '',
    icon: '🍱'
  });

  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    item: null
  });

  // Reset menu dialog
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Filtered menu
  const filteredMenu = menu.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleOpenAddModal = () => {
    sound.playTap();
    setEditingItem(null);
    setFormError('');
    setFormData({
      name: '',
      price: '',
      category: 'Tiffins',
      available: true,
      description: '',
      icon: '🍱'
    });
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (item) => {
    sound.playTap();
    setEditingItem(item);
    setFormError('');
    setFormData({
      name: item.name,
      price: item.price,
      category: item.category || 'Tiffins',
      available: item.available !== false,
      description: item.description || '',
      icon: item.icon || '🍱'
    });
    setIsFormOpen(true);
  };

  const handleToggleAvailability = (itemId) => {
    sound.playTap();
    const updated = menu.map((it) => {
      if (it.id === itemId) {
        return { ...it, available: !it.available };
      }
      return it;
    });
    onSaveMenu(updated);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    
    // Strict Validation as per Section 30
    if (!formData.name.trim()) {
      setFormError('Please enter a tiffin name.');
      return;
    }

    const priceNum = Number(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError('Please enter a valid price.');
      return;
    }

    sound.playSuccess();

    if (editingItem) {
      // Update existing item (Note: old bills will stay with their original saved price)
      const updated = menu.map((it) => {
        if (it.id === editingItem.id) {
          return {
            ...it,
            name: formData.name.trim(),
            price: priceNum,
            category: formData.category,
            available: formData.available,
            description: formData.description.trim(),
            icon: formData.icon || '🍱'
          };
        }
        return it;
      });
      onSaveMenu(updated);
    } else {
      // Add new tiffin item
      const newItem = {
        id: `t-${Date.now()}`,
        name: formData.name.trim(),
        price: priceNum,
        category: formData.category,
        available: formData.available,
        description: formData.description.trim(),
        icon: formData.icon || '🍱',
        isVeg: true
      };
      onSaveMenu([newItem, ...menu]);
    }

    setIsFormOpen(false);
  };

  const handleDeleteClick = (item) => {
    sound.playTap();
    setDeleteDialog({
      isOpen: true,
      item
    });
  };

  const confirmDelete = () => {
    if (deleteDialog.item) {
      const updated = menu.filter((it) => it.id !== deleteDialog.item.id);
      onSaveMenu(updated);
    }
    setDeleteDialog({ isOpen: false, item: null });
  };

  const emojiOptions = ['🥟', '🍩', '🥞', '🌯', '🫓', '🥣', '🍲', '🫖', '☕', '🥛', '🍚', '🧆', '🥪', '🥘', '🍱'];

  return (
    <div className="manage-tiffins-container">
      {/* Header toolbar */}
      <div className="menu-panel-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem' }}>Manage Tiffins</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Add, update prices, change availability status, or remove items from the menu.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-secondary-action"
            onClick={() => {
              sound.playTap();
              setIsResetConfirmOpen(true);
            }}
            title="Reset menu to original sample items"
          >
            <RotateCcw size={16} />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            className="btn-primary-action"
            onClick={handleOpenAddModal}
          >
            <Plus size={18} />
            <span>+ ADD TIFFIN</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <div className="search-input-wrapper" style={{ flex: '1 1 300px' }}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search tiffin by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="menu-search-input"
          />
        </div>

        <div className="category-pills-bar" style={{ margin: 0, padding: 0 }}>
          {DEFAULT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => {
                sound.playTap();
                setSelectedCategory(cat);
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table of Items */}
      <div className="data-table-container">
        <table className="pos-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Item</th>
              <th>Tiffin Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Availability</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMenu.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
                  <div style={{ fontWeight: 700 }}>No tiffins found</div>
                  <div style={{ fontSize: '0.85rem' }}>Click "+ ADD TIFFIN" to add your first item.</div>
                </td>
              </tr>
            ) : (
              filteredMenu.map((item) => (
                <tr key={item.id}>
                  {/* Icon */}
                  <td>
                    <span style={{ fontSize: '1.5rem' }}>{item.icon || '🍱'}</span>
                  </td>

                  {/* Name */}
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.98rem' }}>
                      {item.name}
                    </div>
                    {item.description && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {item.description}
                      </div>
                    )}
                  </td>

                  {/* Category */}
                  <td>
                    <span 
                      style={{ 
                        fontSize: '0.8rem', 
                        padding: '0.2rem 0.6rem', 
                        borderRadius: '6px', 
                        background: 'var(--bg-subtle)',
                        fontWeight: 600,
                        color: 'var(--text-muted)'
                      }}
                    >
                      {item.category || 'Tiffins'}
                    </span>
                  </td>

                  {/* Price */}
                  <td>
                    <span style={{ fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--primary-700)', fontSize: '1.1rem' }}>
                      ₹{item.price}
                    </span>
                  </td>

                  {/* Status Toggle */}
                  <td>
                    <button
                      type="button"
                      onClick={() => handleToggleAvailability(item.id)}
                      className={`status-pill ${item.available !== false ? 'available' : 'unavailable'}`}
                      title="Click to toggle availability"
                      style={{ cursor: 'pointer' }}
                    >
                      {item.available !== false ? (
                        <>
                          <CheckCircle2 size={13} />
                          <span>Available</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={13} />
                          <span>Unavailable</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        className="btn-secondary-action"
                        style={{ padding: '0.35rem 0.65rem' }}
                        onClick={() => handleOpenEditModal(item)}
                        title="Edit Tiffin"
                      >
                        <Edit3 size={15} />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        className="btn-secondary-action clear-btn"
                        style={{ padding: '0.35rem 0.65rem' }}
                        onClick={() => handleDeleteClick(item)}
                        title="Delete Tiffin"
                      >
                        <Trash2 size={15} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={() => setIsFormOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem' }}>
                {editingItem ? 'Edit Tiffin' : 'Add Tiffin'}
              </h3>
              <button 
                type="button"
                onClick={() => setIsFormOpen(false)} 
                className="cart-row-delete-btn"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm}>
              <div className="modal-body">
                {formError && (
                  <div className="cart-error-banner" style={{ marginBottom: '1rem' }}>
                    <AlertCircle size={16} />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Tiffin Name */}
                <div className="form-group">
                  <label className="form-label">Tiffin Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Masala Dosa, Idly, Filter Coffee"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (formError) setFormError('');
                    }}
                    className="form-input"
                    autoFocus
                  />
                </div>

                {/* Price & Category in row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      step="1"
                      placeholder="e.g. 50"
                      value={formData.price}
                      onChange={(e) => {
                        setFormData({ ...formData, price: e.target.value });
                        if (formError) setFormError('');
                      }}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="form-select"
                    >
                      {DEFAULT_CATEGORIES.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Availability */}
                <div className="form-group">
                  <label className="form-label">Availability</label>
                  <select
                    value={formData.available ? 'Available' : 'Unavailable'}
                    onChange={(e) => setFormData({ ...formData, available: e.target.value === 'Available' })}
                    className="form-select"
                  >
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>

                {/* Emoji Selector */}
                <div className="form-group">
                  <label className="form-label">Icon / Emoji</label>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {emojiOptions.map(em => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: em })}
                        style={{
                          fontSize: '1.25rem',
                          padding: '0.35rem 0.5rem',
                          borderRadius: '8px',
                          background: formData.icon === em ? 'var(--primary-100)' : 'var(--bg-subtle)',
                          border: formData.icon === em ? '2px solid var(--primary-600)' : '1px solid var(--border-light)'
                        }}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description (Optional) */}
                <div className="form-group">
                  <label className="form-label">Description (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Served with fresh coconut chutney & hot sambar"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary-action"
                  onClick={() => setIsFormOpen(false)}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="btn-primary-action"
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Item Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Tiffin"
        message="Are you sure you want to delete this tiffin?"
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, item: null })}
      />

      {/* Reset Default Menu Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title="Reset to Default Tiffins?"
        message="This will restore all default tiffins (Idly ₹30, Vada ₹25, Dosa ₹40, Masala Dosa ₹50, Poori ₹45, Upma ₹35, Pongal ₹40, Tea ₹15, Coffee ₹20, etc.)."
        confirmText="Reset Menu"
        cancelText="Cancel"
        isDestructive={false}
        onConfirm={() => {
          onResetDefaultMenu();
          setIsResetConfirmOpen(false);
        }}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
}
