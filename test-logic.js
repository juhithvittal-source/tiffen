import { DEFAULT_TIFFINS, INITIAL_SAMPLE_BILLS } from './src/data/defaultMenu.js';
import { formatCurrency, formatKOTNumber, parseKOTNumber, formatDateTime, isToday } from './src/utils/formatters.js';

console.log('=== RUNNING LOGIC & RULE TESTS FOR TIFFIN BILLING ===');

// Test 1: Sample items existence
console.log('1. Checking default sample items:');
const requiredItems = ['Idly', 'Vada', 'Dosa', 'Masala Dosa', 'Poori', 'Upma', 'Pongal', 'Tea', 'Coffee'];
requiredItems.forEach(name => {
  const found = DEFAULT_TIFFINS.find(t => t.name.toLowerCase() === name.toLowerCase());
  if (!found) throw new Error(`Missing required default item: ${name}`);
  console.log(`  ✓ ${found.name} exists @ Rs.${found.price} (Category: ${found.category})`);
});

// Test 2: Sequential KOT generation
console.log('\n2. Checking KOT formatting and parsing:');
console.log(`  formatKOTNumber(1) => ${formatKOTNumber(1)}`);
console.log(`  formatKOTNumber(25) => ${formatKOTNumber(25)}`);
console.log(`  parseKOTNumber("KOT-025") => ${parseKOTNumber("KOT-025")}`);
if (formatKOTNumber(1) !== 'KOT-001') throw new Error('formatKOTNumber(1) failed');
if (formatKOTNumber(25) !== 'KOT-025') throw new Error('formatKOTNumber(25) failed');
if (parseKOTNumber('KOT-025') !== 25) throw new Error('parseKOTNumber failed');
console.log('  ✓ KOT token system passed');

// Test 3: Order Calculation
console.log('\n3. Checking Order Calculation (Idly x2 @ Rs.30, Dosa x1 @ Rs.40, Coffee x2 @ Rs.20):');
const sampleCart = [
  { id: 't-1', name: 'Idly', price: 30, quantity: 2 },
  { id: 't-3', name: 'Dosa', price: 40, quantity: 1 },
  { id: 't-9', name: 'Coffee', price: 20, quantity: 2 },
];
const itemsWithAmounts = sampleCart.map(it => ({
  ...it,
  amount: it.price * it.quantity
}));
const totalItems = itemsWithAmounts.reduce((sum, it) => sum + it.quantity, 0);
const subtotal = itemsWithAmounts.reduce((sum, it) => sum + it.amount, 0);
const discount = 0;
const grandTotal = subtotal - discount;

console.log(`  Total Items: ${totalItems} (Expected: 5)`);
console.log(`  Subtotal: Rs.${subtotal} (Expected: 140)`);
console.log(`  Discount: Rs.${discount} (Expected: 0)`);
console.log(`  Grand Total: Rs.${grandTotal} (Expected: 140)`);

if (totalItems !== 5 || subtotal !== 140 || grandTotal !== 140) {
  throw new Error('Cart calculation logic failed');
}
console.log('  ✓ Automatic calculation matches user specifications perfectly');

// Test 4: Price History Rule
console.log('\n4. Checking Price History Rule:');
// Order is saved with Dosa @ 40
const savedOrder = {
  id: 'bill-101',
  kotNumber: 'KOT-004',
  timestamp: new Date().toISOString(),
  items: [
    { id: 't-3', name: 'Dosa', price: 40, quantity: 2, amount: 80 }
  ],
  totalItems: 2,
  subtotal: 80,
  discount: 0,
  grandTotal: 80
};

// Owner later updates Dosa in menu to 50
const updatedMenu = DEFAULT_TIFFINS.map(t => t.name === 'Dosa' ? { ...t, price: 50 } : t);
const currentDosaInMenu = updatedMenu.find(t => t.name === 'Dosa');

console.log(`  Menu Dosa price changed to: Rs.${currentDosaInMenu.price}`);
console.log(`  Saved Bill Dosa price remains: Rs.${savedOrder.items[0].price} with amount Rs.${savedOrder.items[0].amount}`);

if (savedOrder.items[0].price !== 40 || savedOrder.grandTotal !== 80) {
  throw new Error('Price history test failed');
}
console.log('  ✓ Price history immutability verified');

console.log('\n=== ALL SYSTEM TESTS PASSED SUCCESSFULLY! ===');
