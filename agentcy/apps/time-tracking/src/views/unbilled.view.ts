import {
  AggregateOperations,
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';

import {
  TIME_ENTRY_FIELD_IDS,
  TIME_ENTRY_OBJECT_ID,
  UNBILLED_VIEW,
} from 'src/constants/universal-identifiers';

// Billable time not on an invoice yet: what to bill next.
export default defineView({
  universalIdentifier: UNBILLED_VIEW.id,
  name: 'Unbilled',
  objectUniversalIdentifier: TIME_ENTRY_OBJECT_ID,
  type: ViewType.TABLE,
  icon: 'IconReceipt',
  position: 1,
  fields: [
    {
      universalIdentifier: UNBILLED_VIEW.fields.name,
      fieldMetadataUniversalIdentifier: TIME_ENTRY_FIELD_IDS.name,
      position: 0,
      isVisible: true,
      size: 280,
    },
    {
      universalIdentifier: UNBILLED_VIEW.fields.opportunity,
      fieldMetadataUniversalIdentifier: TIME_ENTRY_FIELD_IDS.opportunity,
      position: 1,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: UNBILLED_VIEW.fields.startedAt,
      fieldMetadataUniversalIdentifier: TIME_ENTRY_FIELD_IDS.startedAt,
      position: 2,
      isVisible: true,
      size: 170,
    },
    {
      universalIdentifier: UNBILLED_VIEW.fields.hours,
      fieldMetadataUniversalIdentifier: TIME_ENTRY_FIELD_IDS.hours,
      position: 3,
      isVisible: true,
      size: 110,
      aggregateOperation: AggregateOperations.SUM,
    },
    {
      universalIdentifier: UNBILLED_VIEW.fields.hourlyRate,
      fieldMetadataUniversalIdentifier: TIME_ENTRY_FIELD_IDS.hourlyRate,
      position: 4,
      isVisible: true,
      size: 130,
    },
    {
      universalIdentifier: UNBILLED_VIEW.fields.teamMember,
      fieldMetadataUniversalIdentifier: TIME_ENTRY_FIELD_IDS.teamMember,
      position: 5,
      isVisible: true,
      size: 150,
    },
    {
      universalIdentifier: UNBILLED_VIEW.fields.invoiced,
      fieldMetadataUniversalIdentifier: TIME_ENTRY_FIELD_IDS.invoiced,
      position: 6,
      isVisible: true,
      size: 100,
    },
  ],
  filters: [
    {
      universalIdentifier: UNBILLED_VIEW.filters.billable,
      fieldMetadataUniversalIdentifier: TIME_ENTRY_FIELD_IDS.billable,
      operand: ViewFilterOperand.IS,
      value: 'true',
    },
    {
      universalIdentifier: UNBILLED_VIEW.filters.invoiced,
      fieldMetadataUniversalIdentifier: TIME_ENTRY_FIELD_IDS.invoiced,
      operand: ViewFilterOperand.IS,
      value: 'false',
    },
    // Leaves out running timers and blank rows (0 h).
    {
      universalIdentifier: UNBILLED_VIEW.filters.hours,
      fieldMetadataUniversalIdentifier: TIME_ENTRY_FIELD_IDS.hours,
      operand: ViewFilterOperand.GREATER_THAN_OR_EQUAL,
      value: '0.01',
    },
  ],
  sorts: [
    {
      universalIdentifier: UNBILLED_VIEW.sorts.startedAt,
      fieldMetadataUniversalIdentifier: TIME_ENTRY_FIELD_IDS.startedAt,
      direction: ViewSortDirection.DESC,
    },
  ],
});
