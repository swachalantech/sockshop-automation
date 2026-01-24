/**
 * Petstore API Client
 * ===================
 * API client for Petstore Swagger API
 */

import { APIRequestContext } from '@playwright/test';
import { API_BASE_URLS } from '@config/index';

export interface Pet {
  id?: number;
  name: string;
  status: 'available' | 'pending' | 'sold';
  category?: {
    id: number;
    name: string;
  };
  photoUrls: string[];
  tags?: {
    id: number;
    name: string;
  }[];
}

export interface ApiResponse<T> {
  status: number;
  data: T;
}

export class PetstoreClient {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async createPet(pet: Pet): Promise<ApiResponse<Pet>> {
    const response = await this.request.post(`${API_BASE_URLS.petstore}/pet`, {
      data: pet,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return {
      status: response.status(),
      data: await response.json(),
    };
  }

  async getPetById(petId: number): Promise<ApiResponse<Pet>> {
    const response = await this.request.get(`${API_BASE_URLS.petstore}/pet/${petId}`, {
      headers: {
        'accept': 'application/json',
      },
    });

    return {
      status: response.status(),
      data: await response.json(),
    };
  }

  async findByStatus(status: 'available' | 'pending' | 'sold'): Promise<ApiResponse<Pet[]>> {
    const response = await this.request.get(`${API_BASE_URLS.petstore}/pet/findByStatus`, {
      params: { status },
      headers: {
        'accept': 'application/json',
      },
    });

    return {
      status: response.status(),
      data: await response.json(),
    };
  }
}
