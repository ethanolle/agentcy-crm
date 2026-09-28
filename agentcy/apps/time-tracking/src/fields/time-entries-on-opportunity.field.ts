import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  OPPORTUNITY_TIME_ENTRIES_FIELD_ID,
  TIME_ENTRY_FIELD_IDS,
  TIME_ENTRY_OBJECT_ID,
} from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: OPPORTUNITY_TIME_ENTRIES_FIELD_ID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.RELATION,
  name: 'timeEntries',
  label: 'Time entries',
  description: 'Time logged on this deal',
  icon: 'IconClock',
  relationTargetObjectMetadataUniversalIdentifier: TIME_ENTRY_OBJECT_ID,
  relationTargetFieldMetadataUniversalIdentifier:
    TIME_ENTRY_FIELD_IDS.opportunity,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
