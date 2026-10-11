import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  OPPORTUNITY_PAYMENTS_FIELD_ID,
  PAYMENT_FIELD_IDS,
  PAYMENT_OBJECT_ID,
} from 'src/constants/universal-identifiers';

// SET_NULL: deleting a deal keeps its payment history.
export default defineField({
  universalIdentifier: PAYMENT_FIELD_IDS.opportunity,
  objectUniversalIdentifier: PAYMENT_OBJECT_ID,
  type: FieldType.RELATION,
  name: 'opportunity',
  label: 'Opportunity',
  description: 'The deal these hours were paid for',
  icon: 'IconTargetArrow',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: OPPORTUNITY_PAYMENTS_FIELD_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'opportunityId',
  },
});
