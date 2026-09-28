// Pure helpers behind the time tracker widget: durations, parsing, totals.

const MS_PER_HOUR = 3_600_000;

export type Money = { amountMicros: number | string | null; currencyCode: string | null };

export type SummarizableEntry = {
  hours: number | null;
  billable: boolean | null;
  invoiced: boolean | null;
  endedAt: string | null;
  hourlyRate: Money | null;
};

export type TimeSummary = {
  totalHours: number;
  billableHours: number;
  nonBillableHours: number;
  billableAmount: number;
  unbilledAmount: number;
  entryCount: number;
};

export const roundTo2 = (value: number): number =>
  Math.round((value + Number.EPSILON) * 100) / 100;

// Billed duration of a session: hours with 2 decimals (12 min = 0.2 h).
export const hoursBetween = (start: Date, end: Date): number => {
  const elapsedMs = end.getTime() - start.getTime();

  return elapsedMs <= 0 ? 0 : roundTo2(elapsedMs / MS_PER_HOUR);
};

const pad2 = (value: number): string => String(value).padStart(2, '0');

// Running clock label, e.g. 01:05:09.
export const formatElapsed = (elapsedMs: number): string => {
  const totalSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
};

// 1.5 -> "1.5 h", 2 -> "2 h".
export const formatHours = (hours: number): string =>
  `${roundTo2(hours).toLocaleString('en-US', { maximumFractionDigits: 2 })} h`;

// Accepts "1.5", "1,5", "1:30", "90m", "45 min", "1h30", "1h 30m", "2h".
// Returns hours, or null when the text is not a positive duration.
export const parseHoursInput = (rawInput: string): number | null => {
  const input = rawInput.trim().toLowerCase().replace(/\s+/g, '');

  if (input === '') {
    return null;
  }

  let hours: number | null = null;

  const clock = input.match(/^(\d+):([0-5]?\d)$/);
  const hoursAndMinutes = input.match(/^(\d+(?:[.,]\d+)?)h(?:(\d+)(?:m|min)?)?$/);
  const minutesOnly = input.match(/^(\d+)(?:m|min)$/);
  const decimal = input.match(/^\d*(?:[.,]\d+)?$/);

  if (clock) {
    hours = Number(clock[1]) + Number(clock[2]) / 60;
  } else if (hoursAndMinutes) {
    hours =
      Number(hoursAndMinutes[1].replace(',', '.')) +
      (hoursAndMinutes[2] ? Number(hoursAndMinutes[2]) / 60 : 0);
  } else if (minutesOnly) {
    hours = Number(minutesOnly[1]) / 60;
  } else if (decimal) {
    hours = Number(input.replace(',', '.'));
  }

  if (hours === null || !Number.isFinite(hours) || hours <= 0) {
    return null;
  }

  return roundTo2(hours);
};

const toLocalDateString = (date: Date): string =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

export const todayLocalDateString = (now: Date = new Date()): string =>
  toLocalDateString(now);

// Start/End for time typed in by hand. Today: the session ends now.
// Another day: it starts at 09:00 local time on that day.
export const manualEntryTimes = (
  localDate: string,
  hours: number,
  now: Date = new Date(),
): { startedAt: Date; endedAt: Date } => {
  const durationMs = Math.round(hours * MS_PER_HOUR);

  if (localDate === toLocalDateString(now)) {
    return { startedAt: new Date(now.getTime() - durationMs), endedAt: now };
  }

  const [year, month, day] = localDate.split('-').map(Number);
  const startedAt = new Date(year, month - 1, day, 9, 0, 0, 0);

  return { startedAt, endedAt: new Date(startedAt.getTime() + durationMs) };
};

export const rateOf = (entry: SummarizableEntry, defaultRate: number): number => {
  const amountMicros = entry.hourlyRate?.amountMicros;

  if (amountMicros === null || amountMicros === undefined || amountMicros === '') {
    return defaultRate;
  }

  const rate = Number(amountMicros) / 1_000_000;

  return Number.isFinite(rate) ? rate : defaultRate;
};

// Totals for a set of entries. Only Hours counts: a running timer holds 0 h,
// and a row typed into the table may have no End but still counts.
export const summarizeEntries = (
  entries: SummarizableEntry[],
  defaultRate: number,
): TimeSummary => {
  const summary: TimeSummary = {
    totalHours: 0,
    billableHours: 0,
    nonBillableHours: 0,
    billableAmount: 0,
    unbilledAmount: 0,
    entryCount: 0,
  };

  for (const entry of entries) {
    const hours = Number(entry.hours ?? 0);

    if (!Number.isFinite(hours) || hours <= 0) {
      continue;
    }

    summary.entryCount += 1;
    summary.totalHours += hours;

    if (entry.billable === false) {
      summary.nonBillableHours += hours;
      continue;
    }

    const amount = hours * rateOf(entry, defaultRate);

    summary.billableHours += hours;
    summary.billableAmount += amount;

    if (entry.invoiced !== true) {
      summary.unbilledAmount += amount;
    }
  }

  return {
    totalHours: roundTo2(summary.totalHours),
    billableHours: roundTo2(summary.billableHours),
    nonBillableHours: roundTo2(summary.nonBillableHours),
    billableAmount: roundTo2(summary.billableAmount),
    unbilledAmount: roundTo2(summary.unbilledAmount),
    entryCount: summary.entryCount,
  };
};

export const formatMoney = (amount: number, currencyCode: string): string => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    }).format(amount);
  } catch {
    return `${roundTo2(amount)} ${currencyCode}`;
  }
};

export const rateToMoney = (rate: number, currencyCode: string) => ({
  amountMicros: Math.round(rate * 1_000_000),
  currencyCode,
});
