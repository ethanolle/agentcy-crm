import {
  AggregateOperations,
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';

import {
  DEAL_TIME_ENTRIES_WIDGET_VIEW,
  TIME_ENTRY_FIELD_IDS,
  TIME_ENTRY_OBJECT_ID,
} from 'src/constants/universal-identifiers';

// Backs the "Time entries" table on the opportunity's Time tab. Without a
// view, that widget falls back to chips.
export default defineView({
  universalIdentifier: DEAL_TIME_ENTRIES_WIDGET_VIEW.id,
  name: 'Deal time entries',
  objectUniversalIdentifier: TIME_ENTRY_OBJECT_ID,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconClock',
  fields: [
    {
      universalIdentifier: DEAL_TIME_ENTRIES_WIDGET_VIEW.fields.name,
      fieldMetadataUniversalIdentifier: TIME_ENTRY_FIELD_IDS.name,
      position: 0,
      isVisible: true,
      size: 280,
    },
    {
      universalIdentifier: DEAL_TIME_ENTRIES_WIDGET_VIEW.fields.startedAt,
      fieldMetadataUniversalIdentifier: TIME_ENTRY_FIELD_IDS.startedAt,
      position: 1,
      isVisible: true,
      size: 170,
    },
    {
      universalIdentifier: DEAL_TIME_ENTRIES_WIDGET_VIEW.fields.hours,
      fieldMetadataUniversalIdentifier: TIME_ENTRY_FIELD_IDS.hours,
      position: 2,
      isVisible: true,
      size: 100,
      aggregateOperation: AggregateOperations.SUM,
    },
    {
      universalIdentifier: DEAL_TIME_ENTRIES_WIDGET_VIEW.fields.billable,
      fieldMetadataUniversalIdentifier: TIME_ENTRY_FIELD_IDS.billable,
      position: 3,
      isVisible: true,
      size: 100,
    },
    {
      universalIdentifier: DEAL_TIME_ENTRIES_WIDGET_VIEW.fields.invoiced,
      fieldMetadataUniversalIdentifier: TIME_ENTRY_FIELD_IDS.invoiced,
      position: 4,
      isVisible: true,
      size: 100,
    },
    {
      universalIdentifier: DEAL_TIME_ENTRIES_WIDGET_VIEW.fields.hourlyRate,
      fieldMetadataUniversalIdentifier: TIME_ENTRY_FIELD_IDS.hourlyRate,
      position: 5,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: DEAL_TIME_ENTRIES_WIDGET_VIEW.fields.teamMember,
      fieldMetadataUniversalIdentifier: TIME_ENTRY_FIELD_IDS.teamMember,
      position: 6,
      isVisible: true,
      size: 140,
    },
  ],
  // Scopes the table to the deal whose page shows it. Without this filter the
  // widget lists every time entry of the workspace.
  filters: [
    {
      universalIdentifier:
        DEAL_TIME_ENTRIES_WIDGET_VIEW.filters.opportunityIsCurrentRecord,
      fieldMetadataUniversalIdentifier: TIME_ENTRY_FIELD_IDS.opportunity,
      operand: ViewFilterOperand.IS,
      value: JSON.stringify({
        selectedRecordIds: [],
        isCurrentRecordSelected: true,
      }),
    },
  ],
  sorts: [
    {
      universalIdentifier: DEAL_TIME_ENTRIES_WIDGET_VIEW.sorts.startedAt,
      fieldMetadataUniversalIdentifier: TIME_ENTRY_FIELD_IDS.startedAt,
      direction: ViewSortDirection.DESC,
    },
  ],
});
