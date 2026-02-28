import '@testing-library/jest-dom';

// Stub global fetch so unit tests don't make real network calls
globalThis.fetch = vi.fn();

// Reset all mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});
