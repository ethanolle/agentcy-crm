import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  OPPORTUNITY_TIME_ENTRIES_FIELD_ID,
  TIME_ENTRY_FIELD_IDS,
  TIME_ENTRY_OBJECT_ID,
} from 'src/constants/universal-identifiers';

// SET_NULL: deleting a deal keeps its logged time (billing history).
export default defineField({
  universalIdentifier: TIME_ENTRY_FIELD_IDS.opportunity,
  objectUniversalIdentifier: TIME_ENTRY_OBJECT_ID,
  type: FieldType.RELATION,
  name: 'opportunity',
  label: 'Opportunity',
  description: 'The deal this time is logged on',
  icon: 'IconTargetArrow',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    OPPORTUNITY_TIME_ENTRIES_FIELD_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'opportunityId',
  },
});
