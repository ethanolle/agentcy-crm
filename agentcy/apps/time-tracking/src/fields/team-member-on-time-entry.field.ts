import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  TIME_ENTRY_FIELD_IDS,
  TIME_ENTRY_OBJECT_ID,
  WORKSPACE_MEMBER_TIME_ENTRIES_FIELD_ID,
} from 'src/constants/universal-identifiers';

// Who did the work. The widget sets it to the signed-in member, and uses it
// to find that member's running timer.
export default defineField({
  universalIdentifier: TIME_ENTRY_FIELD_IDS.teamMember,
  objectUniversalIdentifier: TIME_ENTRY_OBJECT_ID,
  type: FieldType.RELATION,
  name: 'teamMember',
  label: 'Who',
  description: 'Team member who did the work',
  icon: 'IconUserCircle',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    WORKSPACE_MEMBER_TIME_ENTRIES_FIELD_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'teamMemberId',
  },
});
