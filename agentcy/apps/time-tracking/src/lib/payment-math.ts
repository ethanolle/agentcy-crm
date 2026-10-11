import { parseHoursInput, roundTo2, type Money } from 'src/lib/time-math';

// Pure helpers behind the "Paid hours" card: balance, history, input parsing.

export type PaymentMethod =
  | 'BANK_TRANSFER'
  | 'CREDIT_CARD'
  | 'BIT'
  | 'PAYPAL'
  | 'CASH'
  | 'CHECK'
  | 'OTHER';

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  BANK_TRANSFER: 'Bank transfer',
  CREDIT_CARD: 'Credit card',
  BIT: 'Bit',
  PAYPAL: 'PayPal',
  CASH: 'Cash',
  CHECK: 'Check',
  OTHER: 'Other',
};

export type PaymentRecord = {
  id: string;
  hours: number | null;
  amount: Money | null;
  paidOn: string | null;
  createdAt: string | null;
};

export type PaymentHistoryLine<TPayment extends PaymentRecord> = {
  payment: TPayment;
  change: number;
  totalAfter: number;
};

export type BillingBalance = {
  paidHours: number;
  usedHours: number;
  remainingHours: number;
  paidAmount: number;
};

const amountOf = (amount: Money | null): number => {
  const amountMicros = amount?.amountMicros;

  if (amountMicros === null || amountMicros === undefined || amountMicros === '') {
    return 0;
  }

  const value = Number(amountMicros) / 1_000_000;

  return Number.isFinite(value) ? value : 0;
};

const hoursOf = (payment: PaymentRecord): number => {
  const hours = Number(payment.hours ?? 0);

  return Number.isFinite(hours) ? hours : 0;
};

// Oldest first by payment day, then by when it was recorded, so the running
// total reads like the deal's story. A payment with no day sorts by its
// record time.
const chronologicalKey = (payment: PaymentRecord): string =>
  `${payment.paidOn ?? payment.createdAt?.slice(0, 10) ?? ''}|${payment.createdAt ?? ''}`;

// Newest first, each line with the paid total right after it.
export const paymentHistory = <TPayment extends PaymentRecord>(
  payments: TPayment[],
): PaymentHistoryLine<TPayment>[] => {
  const sorted = [...payments].sort((left, right) =>
    chronologicalKey(left).localeCompare(chronologicalKey(right)),
  );

  let total = 0;

  return sorted
    .map((payment) => {
      const change = roundTo2(hoursOf(payment));

      total = roundTo2(total + change);

      return { payment, change, totalAfter: total };
    })
    .reverse();
};

// Used = billable hours logged: non-billable work doesn't eat the package.
export const billingBalance = (
  payments: PaymentRecord[],
  usedHours: number,
): BillingBalance => {
  const paidHours = roundTo2(
    payments.reduce((sum, payment) => sum + hoursOf(payment), 0),
  );

  return {
    paidHours,
    usedHours: roundTo2(usedHours),
    remainingHours: roundTo2(paidHours - usedHours),
    paidAmount: roundTo2(
      payments.reduce((sum, payment) => sum + amountOf(payment.amount), 0),
    ),
  };
};

// "10" sets the paid total to 10 h; "+5" or "-2" changes it by that much.
// Returns the change to record, or null when the text isn't a duration or
// changes nothing.
export const parsePaidHoursChange = (
  rawInput: string,
  currentPaidHours: number,
): number | null => {
  const input = rawInput.trim();
  const sign = input.startsWith('+') ? 1 : input.startsWith('-') ? -1 : 0;
  const hours = parseHoursInput(sign === 0 ? input : input.slice(1));

  if (hours === null) {
    return null;
  }

  const change = roundTo2(sign === 0 ? hours - currentPaidHours : sign * hours);

  return change === 0 ? null : change;
};

// Accepts "2750", "2,750", "2 750.50". Null when empty or not a positive number.
export const parseAmountInput = (rawInput: string): number | null => {
  const input = rawInput.trim().replace(/[\s,]/g, '');

  if (!/^\d+(\.\d+)?$/.test(input)) {
    return null;
  }

  const amount = Number(input);

  return amount > 0 ? roundTo2(amount) : null;
};

// +5 h / -2 h
export const formatHoursChange = (hours: number): string =>
  `${hours > 0 ? '+' : '-'}${roundTo2(Math.abs(hours)).toLocaleString('en-US', {
    maximumFractionDigits: 2,
  })} h`;
