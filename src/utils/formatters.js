export function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(num);
}

export function formatKOTNumber(num) {
  const n = parseInt(num, 10) || 1;
  return `KOT-${String(n).padStart(3, '0')}`;
}

export function parseKOTNumber(kotStr) {
  if (typeof kotStr === 'number') return kotStr;
  if (!kotStr) return 1;
  const match = kotStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : 1;
}

export function formatDateTime(dateInput) {
  const d = dateInput ? new Date(dateInput) : new Date();
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const strHours = String(hours).padStart(2, '0');

  return {
    date: `${day}-${month}-${year}`,
    time: `${strHours}:${minutes} ${ampm}`,
    full: `${day}-${month}-${year} ${strHours}:${minutes} ${ampm}`,
    isoDate: d.toISOString().split('T')[0]
  };
}

export function isToday(dateInput) {
  if (!dateInput) return false;
  const d = new Date(dateInput);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}
