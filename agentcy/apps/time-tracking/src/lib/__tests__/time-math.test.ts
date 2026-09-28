import { describe, expect, it } from 'vitest';

import {
  formatElapsed,
  formatHours,
  formatMoney,
  hoursBetween,
  manualEntryTimes,
  parseHoursInput,
  summarizeEntries,
  type SummarizableEntry,
} from 'src/lib/time-math';

const entry = (overrides: Partial<SummarizableEntry>): SummarizableEntry => ({
  hours: 1,
  billable: true,
  invoiced: false,
  endedAt: '2026-09-28T10:00:00.000Z',
  hourlyRate: null,
  ...overrides,
});

describe('hoursBetween', () => {
  it('rounds to 2 decimals', () => {
    const start = new Date('2026-09-28T09:00:00Z');

    expect(hoursBetween(start, new Date('2026-09-28T09:12:00Z'))).toBe(0.2);
    expect(hoursBetween(start, new Date('2026-09-28T10:30:00Z'))).toBe(1.5);
    expect(hoursBetween(start, new Date('2026-09-28T09:01:00Z'))).toBe(0.02);
  });

  it('never goes negative', () => {
    const start = new Date('2026-09-28T09:00:00Z');

    expect(hoursBetween(start, new Date('2026-09-28T08:00:00Z'))).toBe(0);
  });
});

describe('formatElapsed', () => {
  it('formats as HH:MM:SS', () => {
    expect(formatElapsed(0)).toBe('00:00:00');
    expect(formatElapsed(3_909_000)).toBe('01:05:09');
    expect(formatElapsed(-5)).toBe('00:00:00');
  });
});

describe('formatHours', () => {
  it('drops useless decimals', () => {
    expect(formatHours(2)).toBe('2 h');
    expect(formatHours(1.5)).toBe('1.5 h');
    expect(formatHours(0.333333)).toBe('0.33 h');
  });
});

describe('parseHoursInput', () => {
  it.each([
    ['1.5', 1.5],
    ['1,5', 1.5],
    ['1:30', 1.5],
    ['0:45', 0.75],
    ['90m', 1.5],
    ['45 min', 0.75],
    ['1h30', 1.5],
    ['1h 30m', 1.5],
    ['2h', 2],
    ['2', 2],
  ])('parses %s', (input, expected) => {
    expect(parseHoursInput(input)).toBe(expected);
  });

  it.each(['', '0', 'abc', '-1', '1:75'])('rejects %s', (input) => {
    expect(parseHoursInput(input)).toBeNull();
  });
});

describe('manualEntryTimes', () => {
  it('ends now when the date is today', () => {
    const now = new Date(2026, 8, 28, 15, 0, 0);
    const { startedAt, endedAt } = manualEntryTimes('2026-09-28', 2, now);

    expect(endedAt).toEqual(now);
    expect(startedAt).toEqual(new Date(2026, 8, 28, 13, 0, 0));
  });

  it('starts at 09:00 on another day', () => {
    const now = new Date(2026, 8, 28, 15, 0, 0);
    const { startedAt, endedAt } = manualEntryTimes('2026-09-25', 1.5, now);

    expect(startedAt).toEqual(new Date(2026, 8, 25, 9, 0, 0));
    expect(endedAt).toEqual(new Date(2026, 8, 25, 10, 30, 0));
  });
});

describe('summarizeEntries', () => {
  it('splits billable, non-billable and unbilled amounts', () => {
    const summary = summarizeEntries(
      [
        entry({ hours: 2 }),
        entry({ hours: 1, invoiced: true }),
        entry({ hours: 0.5, billable: false }),
        entry({
          hours: 1,
          hourlyRate: { amountMicros: '600000000', currencyCode: 'ILS' },
        }),
      ],
      550,
    );

    expect(summary).toEqual({
      totalHours: 4.5,
      billableHours: 4,
      nonBillableHours: 0.5,
      billableAmount: 2250,
      unbilledAmount: 1700,
      entryCount: 4,
    });
  });

  it('ignores running timers', () => {
    const summary = summarizeEntries([entry({ hours: 0, endedAt: null })], 550);

    expect(summary.entryCount).toBe(0);
    expect(summary.totalHours).toBe(0);
  });

  it('counts rows typed into the table without an End', () => {
    const summary = summarizeEntries(
      [entry({ hours: 1, endedAt: null, hourlyRate: { amountMicros: null, currencyCode: null } })],
      550,
    );

    expect(summary.entryCount).toBe(1);
    expect(summary.billableAmount).toBe(550);
  });
});

describe('formatMoney', () => {
  it('formats shekels', () => {
    expect(formatMoney(5500, 'ILS')).toBe('₪5,500');
    expect(formatMoney(82.5, 'ILS')).toBe('₪82.50');
  });
});
