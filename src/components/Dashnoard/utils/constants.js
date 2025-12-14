// src/components/UserDash/utils/constants.js

export const COLORS = [
    '#9CFF00', '#FFAA00', '#FF7F00', '#FF0000',
    '#FF0068', '#F800FF', '#C000FF', '#008CFF',
    '#3F0000', '#5E005A', '#001F63', '#4F4700',
    '#BCBCBC', '#A0A0A0', '#515151', '#111111'
  ];
  
  export const DEFAULT_COLOR = '#A700ED';
  
  export const DEFAULT_ITEM = {
    id: 1,
    description: 'Item Description',
    details: '',
    rate: 0.00,
    qty: 1,
    amount: 0.00
  };
  
  export const DEFAULT_UPCOMING_ITEM = {
    id: 1,
    desc: '',
    price: 0.00
  };
  
  export const DEFAULT_FORM_DATA = {
    invoiceTitle: 'Invoice',
    businessName: 'Business Name',
    businessEmail: 'name@business.com',
    businessStreet: 'Street',
    businessPhone: '07* *** ****',
    businessTax: '07* *** ****',
    clientName: 'Client Name',
    clientEmail: 'name@client.com',
    clientStreet: 'Street',
    clientPhone: '07* *** ****',
    invoiceNumber: `IV${Math.floor(Math.random() * 1000000)}`,
    invoiceDate: 'Nov 27, 2025',
    terms: 'On Receipt',
    notes: '',
    packagePrice: '0'
  };
  
  export const TERMS_OPTIONS = [
    'On Receipt',
    'Net 15',
    'Net 30',
    'Net 60'
  ];
  
  export const DISCOUNT_TYPES = {
    PERCENTAGE: 'percentage',
    PRICE: 'price'
  };
  
  export const IS_MOBILE = window.innerWidth <= 430;