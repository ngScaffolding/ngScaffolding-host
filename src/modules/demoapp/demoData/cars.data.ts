import { ReferenceValue, ReferenceValueItem } from 'ngscaffolding-models';

export const carsReferenceValues: ReferenceValue = {
  name: 'Cars',
  referenceValueItems: [
    {
      display: 'BMW',
      value: 'BMW',
      referenceValueItems: [
        { display: '116i', value: '116' },
        { display: '220', value: '220' },
        { display: '318', value: '318' },
        { display: 'X6', value: 'X6' }
      ]
    },
    {
      display: 'Ford',
      value: 'Ford',
      referenceValueItems: [
        { display: 'Fiesta', value: 'Fiesta' },
        { display: 'Escort', value: 'Escort' },
        { display: 'Sierra', value: 'Sierra' },
        { display: 'Granada', value: 'Granada' }
      ]
    }
  ]
};
