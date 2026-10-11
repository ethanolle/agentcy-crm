import { describe, expect, it } from 'vitest';

import {
  billingBalance,
  formatHoursChange,
  parseAmountInput,
  parsePaidHoursChange,
  paymentHistory,
  type PaymentRecord,
} from 'src/lib/payment-math';

const payment = (overrides: Partial<PaymentRecord>): PaymentRecord => ({
  id: 'payment',
  hours: 5,
  amount: null,
  paidOn: '2026-10-01',
  createdAt: '2026-10-01T09:00:00.000Z',
  ...overrides,
});

describe('parsePaidHoursChange', () => {
  it('reads a plain number as the new paid total', () => {
    expect(parsePaidHoursChange('5', 0)).toBe(5);
    expect(parsePaidHoursChange('10', 5)).toBe(5);
    expect(parsePaidHoursChange('8', 10)).toBe(-2);
    expect(parsePaidHoursChange('1:30', 1)).toBe(0.5);
  });

  it('reads a signed number as a change', () => {
    expect(parsePaidHoursChange('+5', 5)).toBe(5);
    expect(parsePaidHoursChange('-2', 10)).toBe(-2);
    expect(parsePaidHoursChange('+90m', 0)).toBe(1.5);
  });

  it('rejects text that changes nothing or is not a duration', () => {
    expect(parsePaidHoursChange('5', 5)).toBeNull();
    expect(parsePaidHoursChange('', 5)).toBeNull();
    expect(parsePaidHoursChange('abc', 5)).toBeNull();
    expect(parsePaidHoursChange('+', 5)).toBeNull();
  });
});

describe('paymentHistory', () => {
  it('lists newest first with the running paid total', () => {
    const history = paymentHistory([
      payment({ id: 'second', hours: 5, paidOn: '2026-10-11' }),
      payment({ id: 'first', hours: 5, paidOn: '2026-10-01' }),
      payment({ id: 'refund', hours: -1, paidOn: '2026-10-12' }),
    ]);

    expect(
      history.map(({ payment: line, change, totalAfter }) => [
        line.id,
        change,
        totalAfter,
      ]),
    ).toEqual([
      ['refund', -1, 9],
      ['second', 5, 10],
      ['first', 5, 5],
    ]);
  });

  it('orders same-day payments by when they were recorded', () => {
    const history = paymentHistory([
      payment({ id: 'later', createdAt: '2026-10-01T15:00:00.000Z' }),
      payment({ id: 'earlier', createdAt: '2026-10-01T08:00:00.000Z' }),
    ]);

    expect(history.map((line) => line.payment.id)).toEqual(['later', 'earlier']);
  });
});

describe('billingBalance', () => {
  it('compares paid hours with billable hours used', () => {
    expect(
      billingBalance(
        [
          payment({
            hours: 5,
            amount: { amountMicros: 2_750_000_000, currencyCode: 'ILS' },
          }),
          payment({
            hours: 5,
            amount: { amountMicros: '2750000000', currencyCode: 'ILS' },
          }),
        ],
        12.5,
      ),
    ).toEqual({
      paidHours: 10,
      usedHours: 12.5,
      remainingHours: -2.5,
      paidAmount: 5500,
    });
  });

  it('is empty without payments', () => {
    expect(billingBalance([], 0)).toEqual({
      paidHours: 0,
      usedHours: 0,
      remainingHours: 0,
      paidAmount: 0,
    });
  });
});

describe('parseAmountInput', () => {
  it('accepts thousands separators and decimals', () => {
    expect(parseAmountInput('2750')).toBe(2750);
    expect(parseAmountInput('2,750.50')).toBe(2750.5);
    expect(parseAmountInput(' 2 750 ')).toBe(2750);
  });

  it('rejects empty, zero and non-numbers', () => {
    expect(parseAmountInput('')).toBeNull();
    expect(parseAmountInput('0')).toBeNull();
    expect(parseAmountInput('-5')).toBeNull();
    expect(parseAmountInput('abc')).toBeNull();
  });
});

describe('formatHoursChange', () => {
  it('always shows the sign', () => {
    expect(formatHoursChange(5)).toBe('+5 h');
    expect(formatHoursChange(-2.5)).toBe('-2.5 h');
  });
});
