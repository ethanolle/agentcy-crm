import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  OPPORTUNITY_PAYMENTS_FIELD_ID,
  PAYMENT_FIELD_IDS,
  PAYMENT_OBJECT_ID,
} from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: OPPORTUNITY_PAYMENTS_FIELD_ID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.RELATION,
  name: 'timePayments',
  label: 'Payments',
  description: 'Hours the client paid for on this deal',
  icon: 'IconCreditCard',
  relationTargetObjectMetadataUniversalIdentifier: PAYMENT_OBJECT_ID,
  relationTargetFieldMetadataUniversalIdentifier: PAYMENT_FIELD_IDS.opportunity,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
