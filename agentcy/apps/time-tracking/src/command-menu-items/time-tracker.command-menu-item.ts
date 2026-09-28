import { defineCommandMenuItem } from 'twenty-sdk/define';

import {
  TIME_TRACKER_COMMAND_MENU_ITEM_ID,
  TIME_TRACKER_FRONT_COMPONENT_ID,
} from 'src/constants/universal-identifiers';

// "Timer" button on every page: see or stop the running timer, or start one
// on any deal without opening it. Also in Cmd+K as "Time tracker".
export default defineCommandMenuItem({
  universalIdentifier: TIME_TRACKER_COMMAND_MENU_ITEM_ID,
  label: 'Time tracker',
  shortLabel: 'Timer',
  isPinned: true,
  availabilityType: 'GLOBAL',
  frontComponentUniversalIdentifier: TIME_TRACKER_FRONT_COMPONENT_ID,
});
