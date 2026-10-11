// Stable identifiers of everything this app adds to the workspace.
// Generated once: never edit or reuse a value, or the next sync will
// delete the entity (and its data) and recreate it.

export const APP_DISPLAY_NAME = 'Time tracking';
export const APP_DESCRIPTION =
  'Log time on opportunities: start/stop timer, manual timesheet entries, billable or not, and a note of the work done.';

export const APPLICATION_UNIVERSAL_IDENTIFIER =
  '5878133f-9707-433f-982a-bc73d81c4d86';
export const DEFAULT_ROLE_UNIVERSAL_IDENTIFIER =
  '2a28572a-fd60-4a48-83e4-ea433733e88d';

export const APPLICATION_VARIABLE_IDS = {
  defaultHourlyRate: '20b277a6-cd30-4d50-800d-37b8d1aa7f84',
  currencyCode: '47ba1939-e65a-4c4b-a03e-0919682f6a83',
} as const;

export const TIME_ENTRY_OBJECT_ID = '066d115b-90bc-4017-9317-771aff0cc4c9';

export const TIME_ENTRY_FIELD_IDS = {
  name: 'a6c0abff-73a0-4fb5-a22c-6b08c023948b',
  startedAt: '26cded2f-0c30-491c-9912-b10e67fc21dc',
  endedAt: 'de1ac34f-4770-4982-bec1-1f26b62c0a5e',
  hours: '4ac9d1f7-666d-425e-b639-beeb704d1be2',
  billable: 'e2d68685-42b6-4a0f-b240-087c19340e72',
  hourlyRate: 'ba233a58-5fd3-4d46-9ff7-4f3d38f46e7e',
  invoiced: 'b718e123-48ae-4fc5-adef-466251f18cbc',
  opportunity: 'c1562526-784e-4d3f-b0b5-be8be6c47873',
  teamMember: '0986454c-cc2d-4c3c-b2ed-6d0eae73f6b7',
} as const;

// Reverse sides of the relations, hosted on standard objects.
export const OPPORTUNITY_TIME_ENTRIES_FIELD_ID =
  '57d71b8b-4cd8-481a-8db8-a0ee0f0083a6';
export const WORKSPACE_MEMBER_TIME_ENTRIES_FIELD_ID =
  '78fd4f1f-7559-4aac-97ba-9348fb0088ea';

export const TIME_TRACKER_FRONT_COMPONENT_ID =
  '44b8e00c-edab-4da3-98dd-7cebd4f64861';
export const TIME_TRACKER_COMMAND_MENU_ITEM_ID =
  '894a6bc8-98f7-4b41-8610-d79e01373816';

export const OPPORTUNITY_TIME_TAB_ID = '5097c0e7-bc64-4a02-8c3a-b8458cbdd5a6';
export const OPPORTUNITY_TIME_TRACKER_WIDGET_ID =
  'd0e82feb-35ce-4fb7-8a3c-843794696438';
export const OPPORTUNITY_TIME_ENTRIES_WIDGET_ID =
  'cf1edaee-ef6e-40d3-9cfb-9b82eeb883e7';

export const TIME_ENTRIES_NAVIGATION_MENU_ITEM_ID =
  'c2f7de0c-ca03-489d-9eb2-37c099bf8a27';

export const UNBILLED_VIEW = {
  id: 'd5ba1737-d04a-41d5-96eb-2a3d1b3c2342',
  fields: {
    name: 'b2def9fe-ffdd-4642-863f-21e6cdb83ba3',
    opportunity: '53fe2775-8947-4e64-9fe1-983074e0296b',
    startedAt: '284bff37-e7fa-41f7-8ad5-78d2d2eb92a7',
    hours: 'd85e5099-d294-4ba2-a98a-7b0e0217a58e',
    hourlyRate: '093f5a0a-8772-4ba1-a0c9-07cab21be219',
    teamMember: 'cf72ce5b-57d5-44a4-8cbc-7e00ad080132',
    invoiced: '508584d9-d172-4592-889f-87bb25bc3348',
  },
  filters: {
    billable: '6d063a2e-8a82-4a53-a6c1-93297ca0b4ae',
    invoiced: 'ab971c59-86dc-4dd2-8046-0a2e73c49f8e',
    hours: '2bbcef1a-0727-40ca-a0b7-9bffbea558cf',
  },
  sorts: {
    startedAt: '39cbd708-1b38-4b55-b54e-dab87716aecd',
  },
} as const;

// Columns of the entries table on the opportunity's Time tab.
export const DEAL_TIME_ENTRIES_WIDGET_VIEW = {
  id: '429e1fe2-a196-4641-95f0-33cbde3705fd',
  fields: {
    name: '804e66b2-2e9d-4445-acad-89081bb88766',
    startedAt: '1701881d-a901-4a80-9696-7ff927a758e4',
    hours: 'fe2444f9-0d56-4d45-92ad-3658940dd54f',
    billable: '3c846c44-e4c1-4622-afde-a8d17f9074a6',
    invoiced: 'b3bd73e1-dbcd-4ebd-a968-5fec3a4f9b2c',
    hourlyRate: '4a6bfefb-db4f-4a3a-822b-24ab99eebc69',
    teamMember: '50feb5da-7d81-4f0c-9071-80e175782f26',
  },
  filters: {
    opportunityIsCurrentRecord: '187f4383-78f6-4033-af5f-66d064d0e9e9',
  },
  sorts: {
    startedAt: '47463b65-7a2e-489b-b276-8d449e258b04',
  },
} as const;

export const PAYMENT_OBJECT_ID = '566fdf38-db49-4bb4-b6ce-a8734e80b76f';

export const PAYMENT_FIELD_IDS = {
  name: 'a1f33a1f-c816-408f-b3d0-fb618a3c2837',
  hours: 'c52cc126-1d98-4b1f-946f-5693df80b0f4',
  amount: 'ae82c87c-cf43-45b7-8118-4cebfe6afb3b',
  paidOn: 'c60de978-5e1e-4e98-a692-36bb5f78c4de',
  method: '5647ded7-608d-4354-a528-29fd3c0d5c88',
  opportunity: '0857dd45-9789-4191-9b9c-743e0c53b6e0',
} as const;

export const PAYMENT_METHOD_OPTION_IDS = {
  bankTransfer: '6f55b104-dcfe-4396-b660-7116ce8c3701',
  creditCard: '5402692f-e883-4e19-8667-50c9f40acf5f',
  bit: 'b7660ba4-1611-426f-b5e3-a502f2f4bd6f',
  paypal: 'ef77046d-393c-491e-8609-0d6d0c2b852e',
  cash: 'd434bee9-4660-4719-8779-9b5bd029b7a8',
  check: '0e223029-1f2b-440a-8927-0903bec04903',
  other: '6479b1dd-dfc2-42b4-bc14-c14d1d2976b0',
} as const;

export const OPPORTUNITY_PAYMENTS_FIELD_ID =
  '50a6e212-7aae-405c-95f7-26e5f412bfbe';

export const OPPORTUNITY_PAYMENTS_WIDGET_ID =
  '1b42d422-eeba-4b74-94da-fddcb3c43580';

export const PAYMENTS_NAVIGATION_MENU_ITEM_ID =
  '12f8bfc8-987a-425c-adfe-63c2859a6b9d';

export const DEAL_PAYMENTS_WIDGET_VIEW = {
  id: 'c895f121-e170-4fe3-8309-895bf15cc435',
  fields: {
    name: 'b21715b5-6893-4c11-9bfc-393b5df65e8b',
    paidOn: 'c8d0da81-6be2-4c5c-b655-6488c3762dc4',
    hours: '9da71546-9085-4241-bf53-bc9f22510af1',
    amount: '987a13c4-86db-49ab-b8f1-059f2bda2c60',
    method: 'c449fd29-8e70-4ae6-8289-434386698242',
  },
  filters: {
    opportunityIsCurrentRecord: 'b4244143-60fb-43a6-8b0a-0a4b071b4224',
  },
  sorts: {
    paidOn: 'e3809c4b-5fc3-45c3-a733-f17df063150c',
  },
} as const;

export const TIMESHEET_VIEW = {
  id: 'f58245fe-2463-4566-91ea-f043e05de9a1',
  fields: {
    name: '6195921c-e189-4cdc-b4dd-59206cbf4445',
    opportunity: 'd04c584a-b747-4ff9-9ebd-50af13fcc327',
    hours: 'd9c94b68-f303-4df8-8148-20a565dd15a7',
    billable: '06c0319f-7134-434f-86fe-13ffbd1c38e1',
  },
} as const;
