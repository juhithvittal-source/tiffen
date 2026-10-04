import { DEFAULT_TIFFINS, INITIAL_SAMPLE_BILLS } from '../data/defaultMenu';
import { formatKOTNumber, parseKOTNumber } from './formatters';

const STORAGE_KEYS = {
  MENU: 'tiffin_menu_v1',
  BILLS: 'tiffin_bills_v1',
  KOT_COUNTER: 'tiffin_kot_counter_v1',
  SETTINGS: 'tiffin_settings_v1'
};

export const Storage = {
  // Menu items
  getMenu() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MENU);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    // Seed initial
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(DEFAULT_TIFFINS));
    return DEFAULT_TIFFINS;
  },

  saveMenu(menu) {
    try {
      localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menu));
    } catch (e) {
      console.error('Failed to save menu:', e);
    }
  },

  // Bills History
  getBills() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BILLS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    // Seed sample bills if empty
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(INITIAL_SAMPLE_BILLS));
    return INITIAL_SAMPLE_BILLS;
  },

  saveBills(bills) {
    try {
      localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
    } catch (e) {
      console.error('Failed to save bills:', e);
    }
  },

  addBill(bill) {
    const bills = this.getBills();
    const updated = [bill, ...bills];
    this.saveBills(updated);
    return updated;
  },

  // KOT Counter
  getNextKOTNumber() {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.KOT_COUNTER);
      if (val !== null) {
        return parseInt(val, 10);
      }
    } catch {
      // ignore
    }
    // compute highest from bills or default to 4 (since sample has 1, 2, 3)
    const bills = this.getBills();
    let maxNum = 0;
    bills.forEach(b => {
      const num = parseKOTNumber(b.kotNumber);
      if (num > maxNum) maxNum = num;
    });
    const next = maxNum + 1;
    localStorage.setItem(STORAGE_KEYS.KOT_COUNTER, String(next));
    return next;
  },

  incrementKOTNumber() {
    const current = this.getNextKOTNumber();
    const next = current + 1;
    try {
      localStorage.setItem(STORAGE_KEYS.KOT_COUNTER, String(next));
    } catch {
      // ignore
    }
    return next;
  },

  // Business settings
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    const defaultSettings = {
      businessName: 'TIFFIN BILLING',
      tagline: 'Authentic & Fresh Hot Tiffins',
      address: 'Main Bazaar Road, Near Bus Stand',
      phone: '+91 98765 43210',
      fssai: '20261004123456'
    };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
    return defaultSettings;
  },

  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  },

  // Reset entire database to defaults
  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(DEFAULT_TIFFINS));
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(INITIAL_SAMPLE_BILLS));
    localStorage.setItem(STORAGE_KEYS.KOT_COUNTER, '4');
    return {
      menu: DEFAULT_TIFFINS,
      bills: INITIAL_SAMPLE_BILLS,
      kotCounter: 4
    };
  }
};
