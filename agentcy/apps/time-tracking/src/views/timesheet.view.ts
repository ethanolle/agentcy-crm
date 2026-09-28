import { defineView, ViewCalendarLayout, ViewType } from 'twenty-sdk/define';

import {
  TIME_ENTRY_FIELD_IDS,
  TIME_ENTRY_OBJECT_ID,
  TIMESHEET_VIEW,
} from 'src/constants/universal-identifiers';

// Week calendar of work sessions, placed by Start and End.
export default defineView({
  universalIdentifier: TIMESHEET_VIEW.id,
  name: 'Timesheet',
  objectUniversalIdentifier: TIME_ENTRY_OBJECT_ID,
  type: ViewType.CALENDAR,
  icon: 'IconCalendarWeek',
  position: 2,
  calendarLayout: ViewCalendarLayout.WEEK,
  calendarFieldMetadataUniversalIdentifier: TIME_ENTRY_FIELD_IDS.startedAt,
  calendarEndFieldMetadataUniversalIdentifier: TIME_ENTRY_FIELD_IDS.endedAt,
  fields: [
    {
      universalIdentifier: TIMESHEET_VIEW.fields.name,
      fieldMetadataUniversalIdentifier: TIME_ENTRY_FIELD_IDS.name,
      position: 0,
      isVisible: true,
    },
    {
      universalIdentifier: TIMESHEET_VIEW.fields.opportunity,
      fieldMetadataUniversalIdentifier: TIME_ENTRY_FIELD_IDS.opportunity,
      position: 1,
      isVisible: true,
    },
    {
      universalIdentifier: TIMESHEET_VIEW.fields.hours,
      fieldMetadataUniversalIdentifier: TIME_ENTRY_FIELD_IDS.hours,
      position: 2,
      isVisible: true,
    },
    {
      universalIdentifier: TIMESHEET_VIEW.fields.billable,
      fieldMetadataUniversalIdentifier: TIME_ENTRY_FIELD_IDS.billable,
      position: 3,
      isVisible: true,
    },
  ],
});
