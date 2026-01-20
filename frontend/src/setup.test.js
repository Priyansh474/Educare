import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
};
window.localStorage = localStorageMock;

// Mock fetch
global.fetch = () => Promise.resolve({
  json: () => Promise.resolve({}),
});
