import {
  AggregateOperations,
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';

import {
  DEAL_PAYMENTS_WIDGET_VIEW,
  PAYMENT_FIELD_IDS,
  PAYMENT_OBJECT_ID,
} from 'src/constants/universal-identifiers';

// Backs the "Payments" table on the opportunity's Time tab.
export default defineView({
  universalIdentifier: DEAL_PAYMENTS_WIDGET_VIEW.id,
  name: 'Deal payments',
  objectUniversalIdentifier: PAYMENT_OBJECT_ID,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconCreditCard',
  fields: [
    {
      universalIdentifier: DEAL_PAYMENTS_WIDGET_VIEW.fields.name,
      fieldMetadataUniversalIdentifier: PAYMENT_FIELD_IDS.name,
      position: 0,
      isVisible: true,
      size: 240,
    },
    {
      universalIdentifier: DEAL_PAYMENTS_WIDGET_VIEW.fields.paidOn,
      fieldMetadataUniversalIdentifier: PAYMENT_FIELD_IDS.paidOn,
      position: 1,
      isVisible: true,
      size: 130,
    },
    {
      universalIdentifier: DEAL_PAYMENTS_WIDGET_VIEW.fields.hours,
      fieldMetadataUniversalIdentifier: PAYMENT_FIELD_IDS.hours,
      position: 2,
      isVisible: true,
      size: 110,
      aggregateOperation: AggregateOperations.SUM,
    },
    {
      universalIdentifier: DEAL_PAYMENTS_WIDGET_VIEW.fields.amount,
      fieldMetadataUniversalIdentifier: PAYMENT_FIELD_IDS.amount,
      position: 3,
      isVisible: true,
      size: 130,
      aggregateOperation: AggregateOperations.SUM,
    },
    {
      universalIdentifier: DEAL_PAYMENTS_WIDGET_VIEW.fields.method,
      fieldMetadataUniversalIdentifier: PAYMENT_FIELD_IDS.method,
      position: 4,
      isVisible: true,
      size: 140,
    },
  ],
  filters: [
    {
      universalIdentifier:
        DEAL_PAYMENTS_WIDGET_VIEW.filters.opportunityIsCurrentRecord,
      fieldMetadataUniversalIdentifier: PAYMENT_FIELD_IDS.opportunity,
      operand: ViewFilterOperand.IS,
      value: JSON.stringify({
        selectedRecordIds: [],
        isCurrentRecordSelected: true,
      }),
    },
  ],
  sorts: [
    {
      universalIdentifier: DEAL_PAYMENTS_WIDGET_VIEW.sorts.paidOn,
      fieldMetadataUniversalIdentifier: PAYMENT_FIELD_IDS.paidOn,
      direction: ViewSortDirection.DESC,
    },
  ],
});
