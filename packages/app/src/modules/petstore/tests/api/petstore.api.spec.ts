/**
 * Petstore API Tests
 * ==================
 */

import { test, expect } from '@playwright/test';
import { PetstoreClient } from '../../clients/petstore.client';
import { TestPets } from '../../data/pet.data';

test.describe('Petstore API - Create Pet', () => {

  let petstoreClient: PetstoreClient;

  test.beforeEach(async ({ request }) => {
    petstoreClient = new PetstoreClient(request);
  });

  test('should create a pet with valid data', async () => {
    const petData = TestPets.validPet();

    const response = await petstoreClient.createPet(petData);

    expect(response.status).toBe(200);
    expect(response.data.name).toBe(petData.name);
    expect(response.data.status).toBe(petData.status);
  });

  test('should create and retrieve pet by ID', async () => {
    // Step 1: Create a pet
    const petData = TestPets.validPet();
    const createResponse = await petstoreClient.createPet(petData);
    expect(createResponse.status).toBe(200);

    const createdPetId = createResponse.data.id!;

    // Step 2: Retrieve the pet by ID
    const getResponse = await petstoreClient.getPetById(createdPetId);

    // Step 3: Validate GET response matches POST response
    expect(getResponse.status).toBe(200);
    expect(getResponse.data.id).toBe(createdPetId);
    expect(getResponse.data.name).toBe(createResponse.data.name);
    expect(getResponse.data.status).toBe(createResponse.data.status);
    expect(getResponse.data.category?.name).toBe(createResponse.data.category?.name);
  });

});

test.describe('Petstore API - Find By Status [KAN-6]', () => {

  let petstoreClient: PetstoreClient;

  test.beforeEach(async ({ request }) => {
    petstoreClient = new PetstoreClient(request);
  });

  test('should return 200 when finding pets by status available', async () => {
    const response = await petstoreClient.findByStatus('available');

    expect(response.status).toBe(200);
  });

});
