// Defaults for a new supplier workspace. Each tenant starts with an empty
// operating ledger and a zero-stock product catalog, then enters its own data.
export const initialOrders = [];
export const initialCustomers = [];
export const initialExpenses = [];
export const initialRoutes = [];

export const initialInventory = [
  { id: 'INV-01', name: '19L filled cans', category: 'Ready to dispatch', stock: 0, unit: 'cans', reorder: 180, movement: 'No movements yet' },
  { id: 'INV-02', name: 'Empty returnable cans', category: 'Customer circulation', stock: 0, unit: 'cans', reorder: 400, movement: 'No movements yet' },
  { id: 'INV-03', name: '1.5L bottle packs', category: '12 bottles / pack', stock: 0, unit: 'packs', reorder: 100, movement: 'No movements yet' },
  { id: 'INV-04', name: '500ml bottle cartons', category: '24 bottles / carton', stock: 0, unit: 'cartons', reorder: 60, movement: 'No movements yet' },
  { id: 'INV-05', name: 'Caps & safety seals', category: 'Packaging supplies', stock: 0, unit: 'pieces', reorder: 800, movement: 'No movements yet' },
];

export const initialPricing = {
  mode: 'per-can',
  pricePerCan: 140,
  pricePerLitre: 8,
  bottlePackPrice: 420,
  bottleCartonPrice: 360,
};

export const initialComms = {
  whatsappChannel: '',
  contactPhone: '',
  queryHours: 48,
};

export const businessPlans = [
  { name: 'Monthly', price: '30 days', period: 'access', description: 'A month of supplier workspace access', features: ['Customer and order records', 'Route and inventory tools', 'Billing and delivery reports'], recommended: false },
  { name: 'Quarterly', price: '90 days', period: 'access', description: 'Three months of supplier workspace access', features: ['Customer and order records', 'Route and inventory tools', 'Billing and delivery reports'], recommended: true },
  { name: 'Yearly', price: '365 days', period: 'access', description: 'A year of supplier workspace access', features: ['Customer and order records', 'Route and inventory tools', 'Billing and delivery reports'], recommended: false },
];
