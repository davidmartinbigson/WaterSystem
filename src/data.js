const daysAgo = (n) => {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date.toISOString().slice(0, 10);
};

export const initialOrders = [
  { id: 'ORD-1286', customer: 'Zara Ahmed', phone: '0301 248 5091', address: 'Clifton, Block 2', cans: 4, product: '19L returnable', amount: 560, payment: 'Paid', status: 'Delivered', time: '9:20 AM', route: 'Clifton · R1', date: daysAgo(0) },
  { id: 'ORD-1285', customer: 'Ali Raza', phone: '0321 774 6252', address: 'DHA Phase 6', cans: 2, product: '19L returnable', amount: 280, payment: 'Cash on delivery', status: 'On the way', time: '9:45 AM', route: 'DHA · R2', date: daysAgo(0) },
  { id: 'ORD-1284', customer: 'Bilal Residence', phone: '0300 992 1077', address: 'PECHS Block 6', cans: 6, product: '19L returnable', amount: 840, payment: 'Unpaid', status: 'Pending', time: '10:30 AM', route: 'PECHS · R3', date: daysAgo(0) },
  { id: 'ORD-1283', customer: 'Green Leaf Cafe', phone: '0333 468 1902', address: 'Bahadurabad', cans: 12, product: '19L returnable', amount: 1680, payment: 'Paid', status: 'Delivered', time: '8:55 AM', route: 'Gulshan · R4', date: daysAgo(0) },
  { id: 'ORD-1282', customer: 'Mariam Iqbal', phone: '0315 605 2124', address: 'Gulshan-e-Iqbal, 13-D', cans: 3, product: '19L returnable', amount: 420, payment: 'Paid', status: 'Delivered', time: '8:40 AM', route: 'Gulshan · R4', date: daysAgo(0) },
  { id: 'ORD-1281', customer: 'The Fern Hotel', phone: '021 3582 1010', address: 'Clifton, Block 5', cans: 18, product: '19L returnable', amount: 2520, payment: 'Monthly invoice', status: 'Pending', time: '11:15 AM', route: 'Clifton · R1', date: daysAgo(0) },
  { id: 'ORD-1280', customer: 'Usman Siddiqui', phone: '0302 761 8840', address: 'North Nazimabad, Block H', cans: 2, product: '19L returnable', amount: 280, payment: 'Cash on delivery', status: 'Delivered', time: 'Yesterday', route: 'North · R5', date: daysAgo(1) },
  { id: 'ORD-1279', customer: 'Olive Garden Office', phone: '021 3531 6400', address: 'Shahrah-e-Faisal', cans: 10, product: '19L returnable', amount: 1400, payment: 'Paid', status: 'Delivered', time: 'Yesterday', route: 'PECHS · R3', date: daysAgo(1) },
];

export const initialCustomers = [
  { id: 'CUS-0821', name: 'Zara Ahmed', phone: '0301 248 5091', address: 'Clifton, Block 2', route: 'Clifton · R1', cans: 4, balance: 0, frequency: 'Every 2 days', since: 'Apr 2024' },
  { id: 'CUS-0820', name: 'Ali Raza', phone: '0321 774 6252', address: 'DHA Phase 6', route: 'DHA · R2', cans: 2, balance: 280, frequency: 'Daily', since: 'Jun 2023' },
  { id: 'CUS-0819', name: 'Bilal Residence', phone: '0300 992 1077', address: 'PECHS Block 6', route: 'PECHS · R3', cans: 6, balance: 840, frequency: 'Weekly', since: 'Jan 2025' },
  { id: 'CUS-0818', name: 'Green Leaf Cafe', phone: '0333 468 1902', address: 'Bahadurabad', route: 'Gulshan · R4', cans: 12, balance: 0, frequency: 'Daily', since: 'Aug 2022' },
  { id: 'CUS-0817', name: 'Mariam Iqbal', phone: '0315 605 2124', address: 'Gulshan-e-Iqbal, 13-D', route: 'Gulshan · R4', cans: 3, balance: 0, frequency: 'Every 3 days', since: 'Sep 2024' },
  { id: 'CUS-0816', name: 'The Fern Hotel', phone: '021 3582 1010', address: 'Clifton, Block 5', route: 'Clifton · R1', cans: 18, balance: 2520, frequency: 'Daily', since: 'Feb 2021' },
  { id: 'CUS-0815', name: 'Usman Siddiqui', phone: '0302 761 8840', address: 'North Nazimabad, Block H', route: 'North · R5', cans: 2, balance: 0, frequency: 'Weekly', since: 'Nov 2024' },
  { id: 'CUS-0814', name: 'Olive Garden Office', phone: '021 3531 6400', address: 'Shahrah-e-Faisal', route: 'PECHS · R3', cans: 10, balance: 1400, frequency: 'Twice a week', since: 'Mar 2023' },
];

export const initialInventory = [
  { id: 'INV-01', name: '19L filled cans', category: 'Ready to dispatch', stock: 486, unit: 'cans', reorder: 180, movement: '+32 today' },
  { id: 'INV-02', name: 'Empty returnable cans', category: 'Customer circulation', stock: 1620, unit: 'cans', reorder: 400, movement: '+18 returned' },
  { id: 'INV-03', name: '1.5L bottle packs', category: '12 bottles / pack', stock: 74, unit: 'packs', reorder: 100, movement: '−6 today' },
  { id: 'INV-04', name: '500ml bottle cartons', category: '24 bottles / carton', stock: 132, unit: 'cartons', reorder: 60, movement: '+12 today' },
  { id: 'INV-05', name: 'Caps & safety seals', category: 'Packaging supplies', stock: 2150, unit: 'pieces', reorder: 800, movement: '−48 today' },
];

export const initialExpenses = [
  { id: 'EXP-094', title: 'Delivery fuel · Fleet A', category: 'Fuel', amount: 18500, date: daysAgo(0), paidBy: 'Cash' },
  { id: 'EXP-093', title: 'Bottle caps & seals', category: 'Packaging', amount: 12600, date: daysAgo(1), paidBy: 'Bank transfer' },
  { id: 'EXP-092', title: 'Filter replacement · Plant 1', category: 'Maintenance', amount: 9200, date: daysAgo(2), paidBy: 'Cash' },
];

export const initialLicenses = [
  { id: 'LIC-1008', code: 'AQF-8H4K-2M6P-9X7C', plan: 'Quarterly', days: 90, status: 'Active', business: 'BlueSpring Water Co.', email: 'hello@bluespring.pk', createdAt: daysAgo(22), expiresAt: '2026-12-21' },
  { id: 'LIC-1007', code: 'AQF-6M2K-82JQ-4R9P', plan: 'Monthly', days: 30, status: 'Available', business: 'Invite · Karachi', email: '', createdAt: daysAgo(2), expiresAt: '' },
  { id: 'LIC-1006', code: 'AQF-7P3D-1N5Q-8V2A', plan: 'Yearly', days: 365, status: 'Active', business: 'Crystal Drop Supplies', email: 'ops@crystaldrop.pk', createdAt: daysAgo(91), expiresAt: '2027-07-15' },
  { id: 'LIC-1005', code: 'AQF-4B8W-6K1M-3C9F', plan: 'Custom · 45 days', days: 45, status: 'Expired', business: 'FreshSip Traders', email: 'info@freshsip.pk', createdAt: daysAgo(123), expiresAt: '2026-06-28' },
  { id: 'LIC-1004', code: 'AQF-2D9L-7R4H-5P1K', plan: 'Monthly', days: 30, status: 'Available', business: 'Invite · Lahore', email: '', createdAt: daysAgo(8), expiresAt: '' },
];

export const initialRoutes = [
  { id: 'R1', name: 'Clifton & Seaview', zone: 'South Karachi', driver: 'Naveed Akhtar', vehicle: 'KHI-4186', stops: 24, done: 16, cans: 72, status: 'In progress', color: 'mint' },
  { id: 'R2', name: 'DHA Phase 5–8', zone: 'Defence', driver: 'Faisal Khan', vehicle: 'KHI-2291', stops: 18, done: 11, cans: 48, status: 'In progress', color: 'blue' },
  { id: 'R3', name: 'PECHS & Shahrah-e-Faisal', zone: 'East Karachi', driver: 'Sajid Ali', vehicle: 'KHI-7360', stops: 21, done: 19, cans: 86, status: 'Almost done', color: 'orange' },
  { id: 'R4', name: 'Gulshan & Bahadurabad', zone: 'Central Karachi', driver: 'Imran Raza', vehicle: 'KHI-9012', stops: 27, done: 9, cans: 94, status: 'In progress', color: 'purple' },
];

export const businessPlans = [
  { name: 'Starter', price: 'Rs 2,500', period: '/ month', description: 'For a growing local route', features: ['Up to 500 customers', 'Orders & delivery tracking', 'Basic inventory'], recommended: false },
  { name: 'Growth', price: 'Rs 5,500', period: '/ month', description: 'For teams ready to scale', features: ['Unlimited customers', 'Driver & route planning', 'Stock, billing & reports'], recommended: true },
  { name: 'Pro', price: 'Custom', period: '', description: 'For multi-branch operators', features: ['Multiple depots & teams', 'Priority onboarding', 'Dedicated support'], recommended: false },
];
