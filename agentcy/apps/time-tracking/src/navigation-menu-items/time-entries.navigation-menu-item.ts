import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import {
  TIME_ENTRIES_NAVIGATION_MENU_ITEM_ID,
  TIME_ENTRY_OBJECT_ID,
} from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: TIME_ENTRIES_NAVIGATION_MENU_ITEM_ID,
  position: 10,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: TIME_ENTRY_OBJECT_ID,
});
