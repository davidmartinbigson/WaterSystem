import { initialComms } from './data.js';

const money = (amount) => `Rs ${Number(amount || 0).toLocaleString('en-PK')}`;

export const calculateDeliveryBalances = ({ previousBalance = 0, bottleBalance = 0, orderAmount = 0, bottlesDelivered = 0, paymentReceived = 0, bottlesReturned = 0 }) => ({
  previousBalance: Number(previousBalance) || 0,
  totalBalance: (Number(previousBalance) || 0) + (Number(orderAmount) || 0) - (Number(paymentReceived) || 0),
  bottleBalance: Math.max(0, (Number(bottleBalance) || 0) + (Number(bottlesDelivered) || 0) - (Number(bottlesReturned) || 0)),
});

export const buildDeliveryReport = (order, customer, businessName, comms = initialComms, language = 'en') => {
  const isUrdu = language === 'ur';
  const locale = isUrdu ? 'ur-PK' : 'en-GB';
  const deliveredDate = order.date
    ? new Date(`${order.date}T12:00:00`).toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' })
    : new Date().toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' });
  const paymentReceived = Number(order.paymentReceived ?? (order.payment === 'Paid' ? order.amount : 0));
  const previousBalance = Number(order.previousBalance ?? customer?.balance ?? 0);
  const emptyReturned = Number(order.emptyReturned ?? order.cans ?? 0);
  const bottleBalance = Number(order.bottleBalance ?? customer?.bottleBalance ?? 0);
  const totalBalance = Number(order.totalBalance ?? (order.status === 'Delivered' ? customer?.balance || 0 : previousBalance + Number(order.amount || 0) - paymentReceived));
  const queryHours = comms.queryHours || 48;
  const channelLine = comms.whatsappChannel
    ? (isUrdu ? `ہمارے چینل کو سبسکرائب اور فالو کریں: ${comms.whatsappChannel}` : `Please subscribe & follow our channel ${comms.whatsappChannel}`)
    : '';
  const contactLine = isUrdu
    ? `${comms.contactPhone ? `رابطہ نمبر ${comms.contactPhone}۔ ` : ''}کسی سوال یا اپڈیٹ کے لیے ${queryHours} گھنٹوں کے اندر رابطہ کریں۔`
    : comms.contactPhone
      ? `For queries, call ${comms.contactPhone}. Please contact us within ${queryHours} hours for updates.`
      : `For any query, please contact us within ${queryHours} hours for updates.`;
  return (isUrdu ? [
    `محترم صارف ${customer?.name || order.customer}`,
    `ڈیلیوری کی تفصیل: ${deliveredDate}`,
    `وصول شدہ ادائیگی = ${money(paymentReceived)}`,
    `پچھلا بقایا = ${money(previousBalance)}`,
    `ڈیلیور کین = ${order.cans}`,
    `واپس خالی کین = ${emptyReturned}`,
    `موجودہ کین بقایا = ${bottleBalance}`,
    `کل مالی بقایا = ${money(totalBalance)}`,
    contactLine, channelLine, 'شکریہ', businessName || 'واٹر سپلائر',
  ] : [
    `Dear Customer ${customer?.name || order.customer}`,
    `Delivery details on ${deliveredDate}`,
    `Payment Received = ${money(paymentReceived)}`,
    `Previous Balance = ${money(previousBalance)}`,
    `Bottles Deliver = ${order.cans}`,
    `Bottles Empty = ${emptyReturned}`,
    `Balance Bottles = ${bottleBalance}`,
    `Total Bal Amount = ${money(totalBalance)}`,
    contactLine, channelLine, 'Thanks', businessName || 'Water Supplier',
  ]).filter(Boolean).join('\n');
};

export const whatsappNumber = (phone = '') => {
  let digits = String(phone).replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = `92${digits.slice(1)}`;
  if (digits.length === 10 && digits.startsWith('3')) digits = `92${digits}`;
  return digits;
};
