export const DEFAULT_TIFFINS = [
  {
    id: 't-1',
    name: 'Idly',
    price: 30,
    category: 'Breakfast',
    available: true,
    isVeg: true,
    icon: '🥟',
    description: '2 pcs soft steamed rice cakes with chutney & sambar'
  },
  {
    id: 't-2',
    name: 'Vada',
    price: 25,
    category: 'Breakfast',
    available: true,
    isVeg: true,
    icon: '🍩',
    description: 'Crispy golden fried lentil doughnut with sambar'
  },
  {
    id: 't-3',
    name: 'Dosa',
    price: 40,
    category: 'Tiffins',
    available: true,
    isVeg: true,
    icon: '🥞',
    description: 'Crispy golden fermented crepe served with chutneys'
  },
  {
    id: 't-4',
    name: 'Masala Dosa',
    price: 50,
    category: 'Tiffins',
    available: true,
    isVeg: true,
    icon: '🌯',
    description: 'Crisp dosa stuffed with spiced potato masala'
  },
  {
    id: 't-5',
    name: 'Poori',
    price: 45,
    category: 'Breakfast',
    available: true,
    isVeg: true,
    icon: '🫓',
    description: '2 pcs hot fluffy puffed pooris with potato curry'
  },
  {
    id: 't-6',
    name: 'Upma',
    price: 35,
    category: 'Breakfast',
    available: true,
    isVeg: true,
    icon: '🥣',
    description: 'Traditional spiced semolina breakfast dish'
  },
  {
    id: 't-7',
    name: 'Pongal',
    price: 40,
    category: 'Breakfast',
    available: true,
    isVeg: true,
    icon: '🍲',
    description: 'Rich ghee ven pongal seasoned with pepper & cashews'
  },
  {
    id: 't-8',
    name: 'Tea',
    price: 15,
    category: 'Beverages',
    available: true,
    isVeg: true,
    icon: '🫖',
    description: 'Hot brewed milk tea with aromatic spices'
  },
  {
    id: 't-9',
    name: 'Coffee',
    price: 20,
    category: 'Beverages',
    available: true,
    isVeg: true,
    icon: '☕',
    description: 'South Indian filter coffee with frothy milk'
  },
  {
    id: 't-10',
    name: 'Ghee Roast Dosa',
    price: 60,
    category: 'Tiffins',
    available: true,
    isVeg: true,
    icon: '🥞',
    description: 'Extra crisp crepe roasted with pure desi ghee'
  },
  {
    id: 't-11',
    name: 'Onion Rava Dosa',
    price: 55,
    category: 'Tiffins',
    available: true,
    isVeg: true,
    icon: '🥞',
    description: 'Crispy semolina crepe garnished with crunchy onions'
  },
  {
    id: 't-12',
    name: 'Mysore Bonda',
    price: 30,
    category: 'Snacks',
    available: true,
    isVeg: true,
    icon: '🧆',
    description: '4 pcs crispy on outside, fluffy inside bondas'
  },
  {
    id: 't-13',
    name: 'Lemon Rice',
    price: 40,
    category: 'Special',
    available: true,
    isVeg: true,
    icon: '🍚',
    description: 'Tangy lemon infused tempered rice with roasted peanuts'
  },
  {
    id: 't-14',
    name: 'Badam Milk',
    price: 25,
    category: 'Beverages',
    available: true,
    isVeg: true,
    icon: '🥛',
    description: 'Warm saffron flavored almond milk'
  }
];

export const DEFAULT_CATEGORIES = [
  'All',
  'Breakfast',
  'Tiffins',
  'Beverages',
  'Snacks',
  'Special'
];

export const INITIAL_SAMPLE_BILLS = [
  {
    id: 'bill-1',
    kotNumber: 'KOT-001',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    orderType: 'Dine-In',
    items: [
      { id: 't-1', name: 'Idly', price: 30, quantity: 2, amount: 60 },
      { id: 't-2', name: 'Vada', price: 25, quantity: 1, amount: 25 },
      { id: 't-9', name: 'Coffee', price: 20, quantity: 2, amount: 40 }
    ],
    totalItems: 5,
    subtotal: 125,
    discount: 0,
    grandTotal: 125
  },
  {
    id: 'bill-2',
    kotNumber: 'KOT-002',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    orderType: 'Takeaway',
    items: [
      { id: 't-4', name: 'Masala Dosa', price: 50, quantity: 2, amount: 100 },
      { id: 't-5', name: 'Poori', price: 45, quantity: 1, amount: 45 },
      { id: 't-8', name: 'Tea', price: 15, quantity: 2, amount: 30 }
    ],
    totalItems: 5,
    subtotal: 175,
    discount: 10,
    grandTotal: 165
  },
  {
    id: 'bill-3',
    kotNumber: 'KOT-003',
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
    orderType: 'Dine-In',
    items: [
      { id: 't-7', name: 'Pongal', price: 40, quantity: 2, amount: 80 },
      { id: 't-2', name: 'Vada', price: 25, quantity: 2, amount: 50 },
      { id: 't-9', name: 'Coffee', price: 20, quantity: 2, amount: 40 }
    ],
    totalItems: 6,
    subtotal: 170,
    discount: 0,
    grandTotal: 170
  }
];
