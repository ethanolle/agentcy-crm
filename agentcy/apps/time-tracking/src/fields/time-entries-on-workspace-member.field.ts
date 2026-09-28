import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  TIME_ENTRY_FIELD_IDS,
  TIME_ENTRY_OBJECT_ID,
  WORKSPACE_MEMBER_TIME_ENTRIES_FIELD_ID,
} from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: WORKSPACE_MEMBER_TIME_ENTRIES_FIELD_ID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'timeEntries',
  label: 'Time entries',
  description: 'Time logged by this member',
  icon: 'IconClock',
  relationTargetObjectMetadataUniversalIdentifier: TIME_ENTRY_OBJECT_ID,
  relationTargetFieldMetadataUniversalIdentifier:
    TIME_ENTRY_FIELD_IDS.teamMember,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
