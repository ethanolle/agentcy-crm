import { defineApplication, FieldType } from 'twenty-sdk/define';

import {
  APP_DESCRIPTION,
  APP_DISPLAY_NAME,
  APPLICATION_UNIVERSAL_IDENTIFIER,
  APPLICATION_VARIABLE_IDS,
} from 'src/constants/universal-identifiers';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: APP_DISPLAY_NAME,
  description: APP_DESCRIPTION,
  author: 'Agentcy',
  applicationVariables: {
    DEFAULT_HOURLY_RATE: {
      universalIdentifier: APPLICATION_VARIABLE_IDS.defaultHourlyRate,
      label: 'Default hourly rate',
      description:
        'Rate stamped on new time entries, excluding VAT. 550 = the out-of-scope rate in the offer.',
      type: FieldType.NUMBER,
      value: 550,
      isSecret: false,
    },
    CURRENCY_CODE: {
      universalIdentifier: APPLICATION_VARIABLE_IDS.currencyCode,
      label: 'Currency',
      description: 'ISO currency code of the hourly rate (ILS, USD, EUR...).',
      type: FieldType.TEXT,
      value: 'ILS',
      isSecret: false,
    },
  },
});
