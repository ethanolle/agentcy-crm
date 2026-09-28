import {
  definePageLayoutTab,
  PageLayoutTabLayoutMode,
  STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  DEAL_TIME_ENTRIES_WIDGET_VIEW,
  OPPORTUNITY_TIME_ENTRIES_FIELD_ID,
  OPPORTUNITY_TIME_ENTRIES_WIDGET_ID,
  OPPORTUNITY_TIME_TAB_ID,
  OPPORTUNITY_TIME_TRACKER_WIDGET_ID,
  TIME_TRACKER_FRONT_COMPONENT_ID,
} from 'src/constants/universal-identifiers';

// "Time" tab on every opportunity, right after Home: the timer widget on top,
// the deal's time entries as an editable table below it.
export default definePageLayoutTab({
  universalIdentifier: OPPORTUNITY_TIME_TAB_ID,
  pageLayoutUniversalIdentifier:
    STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.opportunityRecordPage
      .universalIdentifier,
  title: 'Time',
  position: 15,
  icon: 'IconClock',
  layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
  widgets: [
    {
      universalIdentifier: OPPORTUNITY_TIME_TRACKER_WIDGET_ID,
      title: 'Time tracker',
      type: 'FRONT_COMPONENT',
      configuration: {
        configurationType: 'FRONT_COMPONENT',
        frontComponentUniversalIdentifier: TIME_TRACKER_FRONT_COMPONENT_ID,
      },
    },
    {
      universalIdentifier: OPPORTUNITY_TIME_ENTRIES_WIDGET_ID,
      title: 'Time entries',
      type: 'FIELD',
      heightBehavior: 'TAB_VIEWPORT',
      configuration: {
        configurationType: 'FIELD',
        fieldMetadataId: OPPORTUNITY_TIME_ENTRIES_FIELD_ID,
        fieldDisplayMode: 'TABLE',
        viewId: DEAL_TIME_ENTRIES_WIDGET_VIEW.id,
      },
    },
  ],
});
