import '@testing-library/jest-dom';

// Mock crypto API for tests
global.crypto = {
    getRandomValues: (array) => {
        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }
        return array;
    },
    subtle: {
        digest: jest.fn()
    }
};

// Mock fetch for tests
global.fetch = jest.fn();

// Reset mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
});