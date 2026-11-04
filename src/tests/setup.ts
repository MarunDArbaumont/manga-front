import '@testing-library/jest-dom';

// Global fetch mock that can be configured per-test
let mockFetchImplementation: ((url: RequestInfo | URL, init?: RequestInit) => Promise<Response>) | null = null;

// Set up global fetch mock
beforeAll(() => {
  globalThis.fetch = jest.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
    if (mockFetchImplementation) {
      return mockFetchImplementation(url, init);
    }
    // Default: throw error on unhandled requests
    throw new Error(`Unhandled request: ${url}`);
  });
});

// Reset mocks after each test
afterEach(() => {
  jest.clearAllMocks();
  mockFetchImplementation = null;
});

// Clean up after all tests
afterAll(() => {
  jest.restoreAllMocks();
});

// Export helper to set mock fetch implementation
export const setMockFetch = (impl: (url: RequestInfo | URL, init?: RequestInit) => Promise<Response>) => {
  mockFetchImplementation = impl;
};
