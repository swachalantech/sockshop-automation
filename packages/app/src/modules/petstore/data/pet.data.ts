/**
 * Pet Test Data
 * =============
 * Test data for Petstore API tests
 */

import { Pet } from '../clients/petstore.client';

export const TestPets = {
  validPet: (): Pet => ({
    id: Math.floor(Math.random() * 100000),
    name: 'Buddy',
    status: 'available',
    category: {
      id: 1,
      name: 'Dogs',
    },
    photoUrls: ['https://example.com/dog.jpg'],
    tags: [
      { id: 1, name: 'friendly' },
    ],
  }),

  minimalPet: (): Pet => ({
    name: 'Max',
    status: 'available',
    photoUrls: [],
  }),

  pendingPet: (): Pet => ({
    name: 'Luna',
    status: 'pending',
    photoUrls: ['https://example.com/cat.jpg'],
  }),

  soldPet: (): Pet => ({
    name: 'Charlie',
    status: 'sold',
    photoUrls: [],
  }),
};
