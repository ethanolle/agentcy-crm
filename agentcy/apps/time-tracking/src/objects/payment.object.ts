import { defineObject, FieldType, NumberDataType } from 'twenty-sdk/define';

import {
  PAYMENT_FIELD_IDS,
  PAYMENT_METHOD_OPTION_IDS,
  PAYMENT_OBJECT_ID,
} from 'src/constants/universal-identifiers';

// Append-only log of hours the client paid for on a deal. Going from 5 h to
// 10 h paid is a new +5 h row, so every change keeps its own date.
export default defineObject({
  universalIdentifier: PAYMENT_OBJECT_ID,
  nameSingular: 'timePayment',
  namePlural: 'timePayments',
  labelSingular: 'Payment',
  labelPlural: 'Payments',
  description: 'Hours paid by the client on an opportunity',
  icon: 'IconCreditCard',
  labelIdentifierFieldMetadataUniversalIdentifier: PAYMENT_FIELD_IDS.name,
  fields: [
    {
      universalIdentifier: PAYMENT_FIELD_IDS.name,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Note',
      description: 'What this payment covers (package, invoice number...)',
      icon: 'IconNotes',
    },
    {
      universalIdentifier: PAYMENT_FIELD_IDS.hours,
      type: FieldType.NUMBER,
      name: 'hours',
      label: 'Hours paid',
      description:
        'Hours added by this payment (1.5 = 1h30). Negative for a refund or correction',
      icon: 'IconClockDollar',
      defaultValue: 0,
      universalSettings: { dataType: NumberDataType.FLOAT, decimals: 2 },
    },
    {
      universalIdentifier: PAYMENT_FIELD_IDS.amount,
      type: FieldType.CURRENCY,
      name: 'amount',
      label: 'Amount',
      description: 'Amount received, excluding VAT',
      icon: 'IconCash',
      isNullable: true,
    },
    {
      universalIdentifier: PAYMENT_FIELD_IDS.paidOn,
      type: FieldType.DATE,
      name: 'paidOn',
      label: 'Paid on',
      description: 'Day the payment was made',
      icon: 'IconCalendarEvent',
      isNullable: true,
    },
    {
      universalIdentifier: PAYMENT_FIELD_IDS.method,
      type: FieldType.SELECT,
      name: 'method',
      label: 'Payment method',
      description: 'How the client paid',
      icon: 'IconWallet',
      isNullable: true,
      options: [
        {
          id: PAYMENT_METHOD_OPTION_IDS.bankTransfer,
          value: 'BANK_TRANSFER',
          label: 'Bank transfer',
          position: 0,
          color: 'blue',
        },
        {
          id: PAYMENT_METHOD_OPTION_IDS.creditCard,
          value: 'CREDIT_CARD',
          label: 'Credit card',
          position: 1,
          color: 'purple',
        },
        {
          id: PAYMENT_METHOD_OPTION_IDS.bit,
          value: 'BIT',
          label: 'Bit',
          position: 2,
          color: 'turquoise',
        },
        {
          id: PAYMENT_METHOD_OPTION_IDS.paypal,
          value: 'PAYPAL',
          label: 'PayPal',
          position: 3,
          color: 'sky',
        },
        {
          id: PAYMENT_METHOD_OPTION_IDS.cash,
          value: 'CASH',
          label: 'Cash',
          position: 4,
          color: 'green',
        },
        {
          id: PAYMENT_METHOD_OPTION_IDS.check,
          value: 'CHECK',
          label: 'Check',
          position: 5,
          color: 'orange',
        },
        {
          id: PAYMENT_METHOD_OPTION_IDS.other,
          value: 'OTHER',
          label: 'Other',
          position: 6,
          color: 'gray',
        },
      ],
    },
  ],
});
