import { defineObject, FieldType, NumberDataType } from 'twenty-sdk/define';

import {
  TIME_ENTRY_FIELD_IDS,
  TIME_ENTRY_OBJECT_ID,
} from 'src/constants/universal-identifiers';

// One row per work session on a deal. A row with no End is a running timer.
// Hours is what billing counts: editing Start/End does not recompute it.
export default defineObject({
  universalIdentifier: TIME_ENTRY_OBJECT_ID,
  nameSingular: 'timeEntry',
  namePlural: 'timeEntries',
  labelSingular: 'Time entry',
  labelPlural: 'Time entries',
  description: 'Time logged on an opportunity (one timesheet line)',
  icon: 'IconClock',
  labelIdentifierFieldMetadataUniversalIdentifier: TIME_ENTRY_FIELD_IDS.name,
  fields: [
    {
      universalIdentifier: TIME_ENTRY_FIELD_IDS.name,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Work done',
      description: 'What was done in this session',
      icon: 'IconNotes',
    },
    {
      universalIdentifier: TIME_ENTRY_FIELD_IDS.startedAt,
      type: FieldType.DATE_TIME,
      name: 'startedAt',
      label: 'Start',
      description: 'When the work started',
      icon: 'IconPlayerPlay',
      defaultValue: 'now',
    },
    {
      universalIdentifier: TIME_ENTRY_FIELD_IDS.endedAt,
      type: FieldType.DATE_TIME,
      name: 'endedAt',
      label: 'End',
      description: 'When the work ended. Empty while the timer is running',
      icon: 'IconPlayerStop',
      isNullable: true,
    },
    {
      universalIdentifier: TIME_ENTRY_FIELD_IDS.hours,
      type: FieldType.NUMBER,
      name: 'hours',
      label: 'Hours',
      description: 'Time spent, in hours (1.5 = 1h30). This is what gets billed',
      icon: 'IconClockHour4',
      defaultValue: 0,
      universalSettings: { dataType: NumberDataType.FLOAT, decimals: 2 },
    },
    {
      universalIdentifier: TIME_ENTRY_FIELD_IDS.billable,
      type: FieldType.BOOLEAN,
      name: 'billable',
      label: 'Billable',
      description: 'Whether this time is charged to the client',
      icon: 'IconCoin',
      defaultValue: true,
    },
    {
      universalIdentifier: TIME_ENTRY_FIELD_IDS.hourlyRate,
      type: FieldType.CURRENCY,
      name: 'hourlyRate',
      label: 'Hourly rate',
      description:
        'Rate for this entry, excluding VAT. Empty = the app default rate',
      icon: 'IconCash',
      isNullable: true,
    },
    {
      universalIdentifier: TIME_ENTRY_FIELD_IDS.invoiced,
      type: FieldType.BOOLEAN,
      name: 'invoiced',
      label: 'Invoiced',
      description: 'Set once this time is on an invoice',
      icon: 'IconReceipt',
      defaultValue: false,
    },
  ],
});
