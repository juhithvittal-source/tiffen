export const DEFAULT_CATEGORIES = [
  'All',
  'Breakfast',
  'Tiffins',
  'Meals',
  'Rice',
  'Curries',
  'Snacks',
  'Beverages',
  'Specials'
];

export const DEFAULT_TIFFINS = [
  {
    id: 't-1',
    name: 'Idly (2 Pcs)',
    price: 30,
    category: 'Breakfast',
    available: true,
    isVeg: true,
    icon: '🥟',
    description: '2 pcs soft steamed rice cakes with chutney & sambar'
  },
  {
    id: 't-2',
    name: 'Medu Vada (1 Pc)',
    price: 25,
    category: 'Breakfast',
    available: true,
    isVeg: true,
    icon: '🍩',
    description: 'Crispy golden fried lentil doughnut with sambar'
  },
  {
    id: 't-3',
    name: 'Plain Dosa',
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
    name: 'Poori Bhaji (2 Pcs)',
    price: 45,
    category: 'Breakfast',
    available: true,
    isVeg: true,
    icon: '🫓',
    description: '2 pcs hot fluffy puffed pooris with potato curry'
  },
  {
    id: 't-6',
    name: 'Rava Upma',
    price: 35,
    category: 'Breakfast',
    available: true,
    isVeg: true,
    icon: '🥣',
    description: 'Traditional spiced semolina breakfast dish'
  },
  {
    id: 't-7',
    name: 'Ghee Ven Pongal',
    price: 40,
    category: 'Breakfast',
    available: true,
    isVeg: true,
    icon: '🍲',
    description: 'Rich ghee ven pongal seasoned with pepper & cashews'
  },
  {
    id: 't-8',
    name: 'Ginger Cardamom Tea',
    price: 15,
    category: 'Beverages',
    available: true,
    isVeg: true,
    icon: '🫖',
    description: 'Hot brewed milk tea with aromatic spices'
  },
  {
    id: 't-9',
    name: 'Filter Coffee',
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
    name: 'Mysore Bonda (4 Pcs)',
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
    category: 'Rice',
    available: true,
    isVeg: true,
    icon: '🍚',
    description: 'Tangy lemon infused tempered rice with roasted peanuts'
  },
  {
    id: 't-14',
    name: 'Saffron Badam Milk',
    price: 25,
    category: 'Beverages',
    available: true,
    isVeg: true,
    icon: '🥛',
    description: 'Warm saffron flavored almond milk'
  },
  {
    id: 't-15',
    name: 'South Indian Executive Meals',
    price: 120,
    category: 'Meals',
    available: true,
    isVeg: true,
    icon: '🍱',
    description: 'Rice, Sambar, Rasam, 2 Curries, Curd, Sweet, Papad, Pickle'
  },
  {
    id: 't-16',
    name: 'Special Mini Meals',
    price: 80,
    category: 'Meals',
    available: true,
    isVeg: true,
    icon: '🍱',
    description: 'Rice, Sambar, Poriyal/Curry, Curd, Papad, Pickle'
  },
  {
    id: 't-17',
    name: 'Sambar Rice',
    price: 50,
    category: 'Rice',
    available: true,
    isVeg: true,
    icon: '🍛',
    description: 'Traditional aromatic ghee sambar rice with appalam'
  },
  {
    id: 't-18',
    name: 'Curd Rice',
    price: 45,
    category: 'Rice',
    available: true,
    isVeg: true,
    icon: '🥣',
    description: 'Cooling tempered curd rice with pomegranate & mustard'
  },
  {
    id: 't-19',
    name: 'Paneer Butter Masala',
    price: 90,
    category: 'Curries',
    available: true,
    isVeg: true,
    icon: '🥘',
    description: 'Rich tomato cashew gravy with fresh cottage cheese cubes'
  },
  {
    id: 't-20',
    name: 'Mix Veg Kurma',
    price: 60,
    category: 'Curries',
    available: true,
    isVeg: true,
    icon: '🍲',
    description: 'Spiced coconut based vegetable kurma for pooris & dosas'
  },
  {
    id: 't-21',
    name: 'Kala Vilas Royal Thali Special',
    price: 160,
    category: 'Specials',
    available: true,
    isVeg: true,
    icon: '👑',
    description: 'Chef special assortment of tiffins, royal curry, dessert & drinks'
  }
];

export const INITIAL_SAMPLE_BILLS = [
  {
    id: 'bill-1',
    orderNumber: 'KV-20261004-001',
    kotNumber: 'KV-101',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    orderType: 'Dine-In',
    tableNumber: 'Table 4',
    customerName: 'Suresh Kumar',
    customerPhone: '9848012345',
    paymentMethod: 'UPI',
    items: [
      { id: 't-1', name: 'Idly (2 Pcs)', price: 30, quantity: 2, amount: 60 },
      { id: 't-2', name: 'Medu Vada (1 Pc)', price: 25, quantity: 1, amount: 25 },
      { id: 't-9', name: 'Filter Coffee', price: 20, quantity: 2, amount: 40 }
    ],
    totalItems: 5,
    subtotal: 125,
    discount: 0,
    grandTotal: 125,
    status: 'Completed'
  },
  {
    id: 'bill-2',
    orderNumber: 'KV-20261004-002',
    kotNumber: 'KV-102',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    orderType: 'Takeaway',
    tableNumber: '',
    customerName: 'Ramesh Reddy',
    customerPhone: '9989054321',
    paymentMethod: 'Cash',
    items: [
      { id: 't-4', name: 'Masala Dosa', price: 50, quantity: 2, amount: 100 },
      { id: 't-5', name: 'Poori Bhaji (2 Pcs)', price: 45, quantity: 1, amount: 45 },
      { id: 't-8', name: 'Ginger Cardamom Tea', price: 15, quantity: 2, amount: 30 }
    ],
    totalItems: 5,
    subtotal: 175,
    discount: 10,
    grandTotal: 165,
    status: 'Completed'
  },
  {
    id: 'bill-3',
    orderNumber: 'KV-20261004-003',
    kotNumber: 'KV-103',
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
    orderType: 'Dine-In',
    tableNumber: 'Table 2',
    customerName: 'Anitha',
    customerPhone: '',
    paymentMethod: 'Card',
    items: [
      { id: 't-7', name: 'Ghee Ven Pongal', price: 40, quantity: 2, amount: 80 },
      { id: 't-2', name: 'Medu Vada (1 Pc)', price: 25, quantity: 2, amount: 50 },
      { id: 't-9', name: 'Filter Coffee', price: 20, quantity: 2, amount: 40 }
    ],
    totalItems: 6,
    subtotal: 170,
    discount: 0,
    grandTotal: 170,
    status: 'Completed'
  }
];

export const DEFAULT_HOTEL_SETTINGS = {
  hotelName: 'KALA VILAS',
  tagline: 'Authentic South Indian Restaurant & Tiffins',
  address: 'Main Road, Near Temple Junction, Heritage Square',
  phone: '+91 94401 23456',
  gstNumber: '', // Only shown if entered by admin
  fssaiNumber: '20261004998877',
  footerMessage: 'Thank you for visiting KALA VILAS. Visit Again!',
  printPaperWidth: '80mm', // '80mm' or '58mm'
  enableSound: true,
  adminPin: '1234' // Default admin pin for protected settings/menu edits
};
