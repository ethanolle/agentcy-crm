import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RestApiClientError } from 'twenty-client-sdk/rest';
import { defineFrontComponent } from 'twenty-sdk/define';
import {
  enqueueSnackbar,
  getApplicationVariable,
  useSelectedObjectMetadata,
  useSelectedRecordIds,
  useUserId,
} from 'twenty-sdk/front-component';
import {
  IconPlayerPlay,
  IconPlayerStop,
  IconPlus,
  IconRefresh,
  IconTrash,
} from 'twenty-ui/icon';
import { Button } from 'twenty-ui/primitives/input';

import { TIME_TRACKER_FRONT_COMPONENT_ID } from 'src/constants/universal-identifiers';
import {
  createTimeEntry,
  deleteTimeEntry,
  fetchOpportunityEntries,
  fetchOpportunityName,
  fetchOpportunityOptions,
  fetchRunningEntries,
  fetchWorkspaceMemberId,
  type OpportunityOption,
  type TimeEntry,
  updateTimeEntry,
} from 'src/lib/time-entries-api';
import {
  formatElapsed,
  formatHours,
  formatMoney,
  hoursBetween,
  manualEntryTimes,
  parseHoursInput,
  rateToMoney,
  summarizeEntries,
  todayLocalDateString,
} from 'src/lib/time-math';

import { TIME_TRACKER_TEST_IDS as TEST_IDS } from './time-tracker-test-ids';

// Timer + manual timesheet + totals for one opportunity. On an opportunity
// page it tracks that deal; opened from the command menu elsewhere, it asks
// which deal. A running timer is a time entry with no End, so it survives
// reloads and devices.

// Picks up edits made in the entries table (the widget can't subscribe to them).
const REFRESH_INTERVAL_MS = 15_000;
const FALLBACK_HOURLY_RATE = 550;
const FALLBACK_CURRENCY_CODE = 'ILS';

const readSettings = () => {
  const rate = Number(getApplicationVariable('DEFAULT_HOURLY_RATE'));
  const currencyCode = (getApplicationVariable('CURRENCY_CODE') ?? '')
    .trim()
    .toUpperCase();

  return {
    defaultRate: Number.isFinite(rate) && rate > 0 ? rate : FALLBACK_HOURLY_RATE,
    currencyCode: /^[A-Z]{3}$/.test(currencyCode)
      ? currencyCode
      : FALLBACK_CURRENCY_CODE,
  };
};

const describeError = (error: unknown): string => {
  if (error instanceof RestApiClientError) {
    const body = error.body as { messages?: string[]; error?: string } | null;

    return body?.messages?.[0] ?? body?.error ?? error.message;
  }

  return error instanceof Error ? error.message : 'Something went wrong';
};

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '12px 16px 16px',
    fontFamily: 'var(--t-font-family)',
    fontSize: 'var(--t-font-size-md)',
    color: 'var(--t-font-color-primary)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
  },
  title: {
    margin: 0,
    fontSize: 'var(--t-font-size-md)',
    fontWeight: 600,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '12px',
    border: '1px solid var(--t-border-color-medium)',
    borderRadius: 'var(--t-border-radius-md)',
    background: 'var(--t-background-secondary)',
  },
  sectionTitle: {
    margin: 0,
    fontSize: 'var(--t-font-size-sm)',
    fontWeight: 600,
    color: 'var(--t-font-color-secondary)',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  spacer: { flex: '1 1 auto' },
  input: {
    flex: '1 1 200px',
    minWidth: 0,
    height: '32px',
    padding: '0 8px',
    boxSizing: 'border-box',
    border: '1px solid var(--t-border-color-medium)',
    borderRadius: 'var(--t-border-radius-sm)',
    background: 'var(--t-background-primary)',
    color: 'var(--t-font-color-primary)',
    fontFamily: 'inherit',
    fontSize: 'inherit',
  },
  // In a column (the cards), flex-basis would set the height: size by width.
  fullWidthInput: {
    flex: 'none',
    width: '100%',
    height: '32px',
    padding: '0 8px',
    boxSizing: 'border-box',
    border: '1px solid var(--t-border-color-medium)',
    borderRadius: 'var(--t-border-radius-sm)',
    background: 'var(--t-background-primary)',
    color: 'var(--t-font-color-primary)',
    fontFamily: 'inherit',
    fontSize: 'inherit',
  },
  checkboxLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: 'var(--t-font-size-sm)',
    color: 'var(--t-font-color-secondary)',
    cursor: 'pointer',
    userSelect: 'none',
  },
  checkbox: { margin: 0, accentColor: 'var(--t-color-blue)' },
  elapsed: {
    fontSize: '22px',
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
  },
  dot: {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--t-color-red)',
  },
  banner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    padding: '8px 12px',
    borderRadius: 'var(--t-border-radius-sm)',
    background: 'var(--t-background-transparent-light)',
    fontSize: 'var(--t-font-size-sm)',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '8px',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: '8px 10px',
    border: '1px solid var(--t-border-color-light)',
    borderRadius: 'var(--t-border-radius-sm)',
    background: 'var(--t-background-primary)',
  },
  statLabel: {
    fontSize: 'var(--t-font-size-xs)',
    color: 'var(--t-font-color-tertiary)',
  },
  statValue: {
    fontSize: 'var(--t-font-size-md)',
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
  },
  muted: {
    fontSize: 'var(--t-font-size-sm)',
    color: 'var(--t-font-color-tertiary)',
  },
  error: {
    fontSize: 'var(--t-font-size-sm)',
    color: 'var(--t-font-color-danger)',
  },
} satisfies Record<string, React.CSSProperties>;

const Stat = ({
  label,
  value,
  testId,
}: {
  label: string;
  value: string;
  testId: string;
}) => (
  <div style={styles.stat}>
    <span style={styles.statLabel}>{label}</span>
    <span style={styles.statValue} data-testid={testId}>
      {value}
    </span>
  </div>
);

const BillableCheckbox = ({
  checked,
  onChange,
  disabled,
  testId,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  testId: string;
}) => (
  <label style={styles.checkboxLabel}>
    <input
      type="checkbox"
      style={styles.checkbox}
      checked={checked}
      disabled={disabled}
      data-testid={testId}
      onChange={(event) => onChange(event.target.checked)}
    />
    Billable
  </label>
);

const TimeTracker = () => {
  const userId = useUserId();
  const selectedRecordIds = useSelectedRecordIds();
  const selectedObjectMetadata = useSelectedObjectMetadata();
  const { defaultRate, currencyCode } = useMemo(readSettings, []);

  const contextOpportunityId =
    selectedObjectMetadata?.nameSingular === 'opportunity' &&
    selectedRecordIds.length === 1
      ? selectedRecordIds[0]
      : null;

  const [memberId, setMemberId] = useState<string | null>(null);
  const [options, setOptions] = useState<OpportunityOption[]>([]);
  const [pickedOpportunityId, setPickedOpportunityId] = useState('');
  const [opportunityName, setOpportunityName] = useState<string | null>(null);
  const [running, setRunning] = useState<TimeEntry | null>(null);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [isConfirmingDiscard, setIsConfirmingDiscard] = useState(false);

  const [timerNote, setTimerNote] = useState('');
  const [timerBillable, setTimerBillable] = useState(true);
  const [runningNote, setRunningNote] = useState('');

  const [manualDate, setManualDate] = useState(() => todayLocalDateString());
  const [manualHours, setManualHours] = useState('');
  const [manualNote, setManualNote] = useState('');
  const [manualBillable, setManualBillable] = useState(true);

  const isBusyRef = useRef(false);
  const refreshRequestRef = useRef(0);

  const opportunityId = contextOpportunityId ?? (pickedOpportunityId || null);
  const runningId = running?.id ?? null;
  const isRunningHere =
    running !== null &&
    (opportunityId === null || running.opportunityId === opportunityId);

  useEffect(() => {
    if (userId === null) {
      return;
    }

    let isCancelled = false;

    fetchWorkspaceMemberId(userId)
      .then((id) => {
        if (!isCancelled) {
          setMemberId(id);
        }
      })
      .catch((caught) => {
        if (!isCancelled) {
          setError(describeError(caught));
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    if (contextOpportunityId !== null) {
      return;
    }

    let isCancelled = false;

    fetchOpportunityOptions()
      .then((loaded) => {
        if (!isCancelled) {
          setOptions(loaded);
        }
      })
      .catch((caught) => {
        if (!isCancelled) {
          setError(describeError(caught));
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [contextOpportunityId]);

  const refresh = useCallback(async () => {
    const requestId = ++refreshRequestRef.current;

    const [runningEntries, opportunityEntries, name] = await Promise.all([
      memberId !== null ? fetchRunningEntries(memberId) : Promise.resolve([]),
      opportunityId !== null
        ? fetchOpportunityEntries(opportunityId)
        : Promise.resolve([]),
      contextOpportunityId !== null
        ? fetchOpportunityName(contextOpportunityId)
        : Promise.resolve(null),
    ]);

    // A newer refresh started meanwhile (deal switched): drop this answer.
    if (requestId !== refreshRequestRef.current) {
      return;
    }

    setRunning(runningEntries[0] ?? null);
    setEntries(opportunityEntries);
    setOpportunityName(name);
    setIsLoaded(true);
  }, [memberId, opportunityId, contextOpportunityId]);

  const refreshSafely = useCallback(async () => {
    try {
      await refresh();
    } catch (caught) {
      setError(describeError(caught));
    }
  }, [refresh]);

  useEffect(() => {
    void refreshSafely();

    const interval = setInterval(() => void refreshSafely(), REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [refreshSafely]);

  // Load the running entry's note into the editable field when it changes.
  useEffect(() => {
    setRunningNote(running?.name ?? '');
    setIsConfirmingDiscard(false);
    // Only when another entry starts running, not on every refresh.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runningId]);

  useEffect(() => {
    if (runningId === null) {
      return;
    }

    setNow(Date.now());

    const tick = setInterval(() => setNow(Date.now()), 1000);

    return () => clearInterval(tick);
  }, [runningId]);

  const runAction = async (action: () => Promise<void>) => {
    if (isBusyRef.current) {
      return;
    }

    isBusyRef.current = true;
    setIsBusy(true);
    setError(null);

    try {
      await action();
    } catch (caught) {
      setError(describeError(caught));
    } finally {
      isBusyRef.current = false;
      setIsBusy(false);
    }
  };

  const stopEntry = async (entry: TimeEntry, note: string): Promise<number> => {
    const endedAt = new Date();
    const startedAt =
      entry.startedAt !== null ? new Date(entry.startedAt) : endedAt;
    const hours = hoursBetween(startedAt, endedAt);

    await updateTimeEntry(entry.id, {
      endedAt: endedAt.toISOString(),
      hours,
      name: note.trim() === '' ? null : note.trim(),
    });

    return hours;
  };

  const handleStart = () =>
    runAction(async () => {
      if (opportunityId === null || memberId === null) {
        return;
      }

      // One timer at a time: starting here stops the one running elsewhere.
      if (running !== null) {
        await stopEntry(running, runningNote);
      }

      await createTimeEntry({
        name: timerNote.trim() === '' ? null : timerNote.trim(),
        startedAt: new Date().toISOString(),
        hours: 0,
        billable: timerBillable,
        invoiced: false,
        hourlyRate: rateToMoney(defaultRate, currencyCode),
        opportunityId,
        teamMemberId: memberId,
      });

      setTimerNote('');
      await refresh();
    });

  const handleStop = () =>
    runAction(async () => {
      if (running === null) {
        return;
      }

      const hours = await stopEntry(running, runningNote);

      await enqueueSnackbar({
        message: `Logged ${formatHours(hours)}`,
        variant: 'success',
      });
      await refresh();
    });

  const handleDiscard = () =>
    runAction(async () => {
      if (running === null) {
        return;
      }

      await deleteTimeEntry(running.id);
      setIsConfirmingDiscard(false);
      await refresh();
    });

  const handleRunningBillableChange = (billable: boolean) =>
    runAction(async () => {
      if (running === null) {
        return;
      }

      setRunning({ ...running, billable });
      await updateTimeEntry(running.id, { billable });
    });

  const handleRunningNoteBlur = () => {
    if (running === null || runningNote === (running.name ?? '')) {
      return;
    }

    void runAction(async () => {
      const name = runningNote.trim() === '' ? null : runningNote.trim();

      setRunning({ ...running, name });
      await updateTimeEntry(running.id, { name });
    });
  };

  const handleAdd = () =>
    runAction(async () => {
      if (opportunityId === null) {
        return;
      }

      const hours = parseHoursInput(manualHours);

      if (hours === null) {
        setError('Enter the time like 1.5, 1:30 or 90m');

        return;
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(manualDate)) {
        setError('Pick the day the work was done');

        return;
      }

      const { startedAt, endedAt } = manualEntryTimes(manualDate, hours);

      await createTimeEntry({
        name: manualNote.trim() === '' ? null : manualNote.trim(),
        startedAt: startedAt.toISOString(),
        endedAt: endedAt.toISOString(),
        hours,
        billable: manualBillable,
        invoiced: false,
        hourlyRate: rateToMoney(defaultRate, currencyCode),
        opportunityId,
        teamMemberId: memberId,
      });

      setManualHours('');
      setManualNote('');
      await enqueueSnackbar({
        message: `Added ${formatHours(hours)}`,
        variant: 'success',
      });
      await refresh();
    });

  const summary = useMemo(
    () => summarizeEntries(entries, defaultRate),
    [entries, defaultRate],
  );

  const elapsedLabel =
    running?.startedAt != null
      ? formatElapsed(now - new Date(running.startedAt).getTime())
      : formatElapsed(0);
  const runningOpportunityName =
    running?.opportunity?.name ?? 'another opportunity';
  const canStart = opportunityId !== null && memberId !== null && !isBusy;

  const onEnter =
    (action: () => void) => (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        action();
      }
    };

  return (
    <div style={styles.root} data-testid={TEST_IDS.root}>
      <div style={styles.header}>
        {contextOpportunityId !== null ? (
          <h3 style={styles.title}>{opportunityName ?? 'Time tracking'}</h3>
        ) : (
          <select
            style={{ ...styles.input, flex: '1 1 auto' }}
            value={pickedOpportunityId}
            data-testid={TEST_IDS.opportunityPicker}
            onChange={(event) => setPickedOpportunityId(event.target.value)}
          >
            <option value="">Choose an opportunity…</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        )}
        <Button
          variant="ghost"
          size="sm"
          startIcon={<IconRefresh size={14} />}
          disabled={isBusy}
          data-testid={TEST_IDS.refreshButton}
          onClick={() => void refreshSafely()}
        >
          Refresh
        </Button>
      </div>

      {error !== null && (
        <div style={styles.error} role="alert" data-testid={TEST_IDS.error}>
          {error}
        </div>
      )}

      {!isLoaded ? (
        <div style={styles.muted}>Loading…</div>
      ) : (
        <>
          {running !== null && !isRunningHere && (
            <div style={styles.banner} data-testid={TEST_IDS.runningElsewhere}>
              <span style={styles.dot} />
              <span>
                Timer running on <strong>{runningOpportunityName}</strong> ·{' '}
                {elapsedLabel}
              </span>
              <span style={styles.spacer} />
              <Button
                variant="outline"
                size="sm"
                color="danger"
                startIcon={<IconPlayerStop size={14} />}
                disabled={isBusy}
                onClick={() => void handleStop()}
              >
                Stop it
              </Button>
            </div>
          )}

          <div style={styles.card}>
            {running !== null && isRunningHere ? (
              <>
                <div style={styles.row}>
                  <span style={styles.dot} />
                  <span style={styles.elapsed} data-testid={TEST_IDS.elapsed}>
                    {elapsedLabel}
                  </span>
                  {opportunityId === null && (
                    <span style={styles.muted}>on {runningOpportunityName}</span>
                  )}
                </div>
                <input
                  style={styles.fullWidthInput}
                  placeholder="What are you working on?"
                  value={runningNote}
                  data-testid={TEST_IDS.timerNoteInput}
                  onChange={(event) => setRunningNote(event.target.value)}
                  onBlur={handleRunningNoteBlur}
                />
                <div style={styles.row}>
                  <BillableCheckbox
                    checked={running.billable !== false}
                    disabled={isBusy}
                    testId={TEST_IDS.timerBillableCheckbox}
                    onChange={(checked) => void handleRunningBillableChange(checked)}
                  />
                  <span style={styles.spacer} />
                  {isConfirmingDiscard ? (
                    <>
                      <span style={styles.muted}>Delete this session?</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isBusy}
                        onClick={() => setIsConfirmingDiscard(false)}
                      >
                        Keep
                      </Button>
                      <Button
                        variant="solid"
                        size="sm"
                        color="danger"
                        disabled={isBusy}
                        data-testid={TEST_IDS.confirmDiscardButton}
                        onClick={() => void handleDiscard()}
                      >
                        Delete
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      startIcon={<IconTrash size={14} />}
                      disabled={isBusy}
                      data-testid={TEST_IDS.discardButton}
                      onClick={() => setIsConfirmingDiscard(true)}
                    >
                      Discard
                    </Button>
                  )}
                  <Button
                    variant="solid"
                    size="sm"
                    color="danger"
                    startIcon={<IconPlayerStop size={14} />}
                    disabled={isBusy}
                    data-testid={TEST_IDS.stopButton}
                    onClick={() => void handleStop()}
                  >
                    Stop & log
                  </Button>
                </div>
              </>
            ) : (
              <>
                <input
                  style={styles.fullWidthInput}
                  placeholder="What are you working on?"
                  value={timerNote}
                  data-testid={TEST_IDS.timerNoteInput}
                  onChange={(event) => setTimerNote(event.target.value)}
                  onKeyDown={onEnter(() => {
                    if (canStart) {
                      void handleStart();
                    }
                  })}
                />
                <div style={styles.row}>
                  <BillableCheckbox
                    checked={timerBillable}
                    testId={TEST_IDS.timerBillableCheckbox}
                    onChange={setTimerBillable}
                  />
                  <span style={styles.spacer} />
                  <Button
                    variant="solid"
                    size="sm"
                    color="accent"
                    startIcon={<IconPlayerPlay size={14} />}
                    disabled={!canStart}
                    data-testid={TEST_IDS.startButton}
                    onClick={() => void handleStart()}
                  >
                    {running !== null ? 'Start here' : 'Start timer'}
                  </Button>
                </div>
              </>
            )}
          </div>

          <div style={styles.card}>
            <p style={styles.sectionTitle}>Log time manually</p>
            <div style={styles.row}>
              <input
                type="date"
                style={{ ...styles.input, flex: '0 0 150px' }}
                value={manualDate}
                max={todayLocalDateString()}
                data-testid={TEST_IDS.manualDateInput}
                onChange={(event) => setManualDate(event.target.value)}
              />
              <input
                style={{ ...styles.input, flex: '0 0 110px' }}
                placeholder="1.5 or 1:30"
                inputMode="decimal"
                value={manualHours}
                data-testid={TEST_IDS.manualHoursInput}
                onChange={(event) => setManualHours(event.target.value)}
                onKeyDown={onEnter(() => void handleAdd())}
              />
              <input
                style={styles.input}
                placeholder="What was done"
                value={manualNote}
                data-testid={TEST_IDS.manualNoteInput}
                onChange={(event) => setManualNote(event.target.value)}
                onKeyDown={onEnter(() => void handleAdd())}
              />
            </div>
            <div style={styles.row}>
              <BillableCheckbox
                checked={manualBillable}
                testId={TEST_IDS.manualBillableCheckbox}
                onChange={setManualBillable}
              />
              <span style={styles.spacer} />
              <Button
                variant="outline"
                size="sm"
                startIcon={<IconPlus size={14} />}
                disabled={opportunityId === null || isBusy}
                data-testid={TEST_IDS.addButton}
                onClick={() => void handleAdd()}
              >
                Add entry
              </Button>
            </div>
          </div>

          {opportunityId !== null ? (
            <div style={styles.stats} data-testid={TEST_IDS.totals}>
              <Stat
                label="Total"
                value={formatHours(summary.totalHours)}
                testId={TEST_IDS.totalHours}
              />
              <Stat
                label="Billable"
                value={formatHours(summary.billableHours)}
                testId={TEST_IDS.billableHours}
              />
              <Stat
                label="Non-billable"
                value={formatHours(summary.nonBillableHours)}
                testId={TEST_IDS.nonBillableHours}
              />
              <Stat
                label="Billable value"
                value={formatMoney(summary.billableAmount, currencyCode)}
                testId={TEST_IDS.billableAmount}
              />
              <Stat
                label="Not invoiced yet"
                value={formatMoney(summary.unbilledAmount, currencyCode)}
                testId={TEST_IDS.unbilledAmount}
              />
            </div>
          ) : (
            <div style={styles.muted}>
              Choose an opportunity to start a timer or log time.
            </div>
          )}

          <div style={styles.muted}>
            Default rate {formatMoney(defaultRate, currencyCode)}/h excl. VAT
            (app settings). Edit hours, billable or invoiced in the table.
          </div>
        </>
      )}
    </div>
  );
};

export default defineFrontComponent({
  universalIdentifier: TIME_TRACKER_FRONT_COMPONENT_ID,
  name: 'time-tracker',
  description:
    'Start/stop timer, manual time entries and billable totals for an opportunity',
  component: TimeTracker,
});
