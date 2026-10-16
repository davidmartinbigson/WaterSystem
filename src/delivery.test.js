import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDeliveryReport, calculateDeliveryBalances, whatsappNumber } from './delivery.js';
import { initialComms } from './data.js';

test('delivery balances include the prior amount, order amount, payment and bottle returns', () => {
  assert.deepEqual(calculateDeliveryBalances({
    previousBalance: 280,
    bottleBalance: 5,
    orderAmount: 420,
    bottlesDelivered: 3,
    paymentReceived: 500,
    bottlesReturned: 2,
  }), { previousBalance: 280, totalBalance: 200, bottleBalance: 6 });
});

test('English report includes supplier, money, returns, query window and channel URL', () => {
  const reportComms = { ...initialComms, whatsappChannel: 'https://wa.me/channel/example' };
  const report = buildDeliveryReport({
    id: 'ORD-1', date: '2026-10-16', cans: 3, amount: 420, paymentReceived: 500,
    previousBalance: 280, emptyReturned: 2, bottleBalance: 6, totalBalance: 200,
  }, { name: 'Amina Khan' }, 'Karachi Pure Water', reportComms, 'en');
  for (const expected of ['Karachi Pure Water', 'Amina Khan', 'Payment Received = Rs 500', 'Previous Balance = Rs 280', 'Bottles Deliver = 3', 'Bottles Empty = 2', 'Balance Bottles = 6', 'Total Bal Amount = Rs 200', '48 hours', reportComms.whatsappChannel]) {
    assert.ok(report.includes(expected), `report is missing: ${expected}`);
  }
});

test('Urdu report uses Urdu copy and phone numbers become WhatsApp-ready', () => {
  const report = buildDeliveryReport({ id: 'ORD-2', date: '2026-10-16', cans: 1, amount: 140, paymentReceived: 140, previousBalance: 0, emptyReturned: 1, bottleBalance: 0, totalBalance: 0 }, { name: 'Ali Raza' }, 'Aqua Pakistan', initialComms, 'ur');
  assert.ok(report.includes('وصول شدہ ادائیگی'));
  assert.ok(report.includes('Aqua Pakistan'));
  assert.equal(whatsappNumber('0300 123 4567'), '923001234567');
  assert.equal(whatsappNumber('+92 300 123 4567'), '923001234567');
});
