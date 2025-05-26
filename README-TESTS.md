# Password Security Analyzer - Test Suite Documentation

## Overview

This document describes the comprehensive test suite for the Password Security Analyzer application. The test suite includes unit tests, integration tests, and end-to-end tests to ensure all functionality works correctly.

## Test Structure

```
tests/
├── unit/
│   ├── passwordAnalyzer.test.js    # Tests for password strength calculation
│   ├── passwordGenerator.test.js   # Tests for password generation
│   └── breachChecker.test.js      # Tests for breach checking functionality
├── integration/
│   └── ui.test.js                 # Tests for UI component interactions
├── setup.js                       # Test environment setup
cypress/
├── e2e/
│   └── passwordAnalyzer.cy.js     # End-to-end tests
├── support/
│   ├── commands.js                # Custom Cypress commands
│   └── e2e.js                     # Cypress support file
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. To use the modular version with tests, use `index-modular.html` instead of `index.html`.

## Running Tests

### Unit and Integration Tests (Jest)

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage report:
```bash
npm run test:coverage
```

### End-to-End Tests (Cypress)

1. Start the local server:
```bash
npm run serve
```

2. In another terminal, run Cypress:

Interactive mode:
```bash
npm run test:ui
```

Headless mode:
```bash
npm run test:ui:run
```

## Test Coverage

### Unit Tests

#### Password Analyzer Tests (`passwordAnalyzer.test.js`)
- **Password Criteria Validation**
  - Empty password returns all criteria as false
  - Length validation (8+ characters)
  - Uppercase letter detection
  - Lowercase letter detection
  - Number detection
  - Special character detection
  - Combined criteria validation

- **Password Strength Calculation**
  - Empty password returns 0 strength
  - Weak passwords (< 40 strength)
  - Fair passwords (40-59 strength)
  - Good passwords (60-79 strength)
  - Strong passwords (80+ strength)
  - Length bonuses (12+ and 16+ characters)
  - Common password penalties
  - Maximum strength capping at 100

- **Strength Information Display**
  - Correct class and color for each strength level
  - Proper text labels for user feedback

#### Password Generator Tests (`passwordGenerator.test.js`)
- **Password Generation**
  - Generates passwords of specified length
  - Uses default length when not specified
  - Character type filtering (uppercase, lowercase, numbers, special)
  - Mixed character type generation
  - Ensures at least one character from each selected type
  - Generates unique passwords on consecutive calls
  - Error handling for invalid options

- **Character Set Validation**
  - Ensures required characters are present
  - Handles edge cases (short passwords, empty charsets)
  - Validates character set contents

- **Options Validation**
  - Length validation (1-128 characters)
  - Character type selection validation
  - Error messages for invalid configurations

#### Breach Checker Tests (`breachChecker.test.js`)
- **SHA-1 Hashing**
  - Generates valid SHA-1 hashes
  - Consistent hashing for same input
  - Different hashes for different inputs

- **Breach Detection**
  - Detects breached passwords
  - Identifies safe passwords
  - Handles API errors gracefully
  - Handles network errors
  - Correct API endpoint usage
  - Handles empty and malformed responses

### Integration Tests

#### UI Integration Tests (`ui.test.js`)
- **Password Input Behavior**
  - Strength meter updates on input
  - Password visibility toggle
  - Criteria indicators update correctly

- **Password Generator UI**
  - Length slider updates display
  - Character option checkboxes work
  - Generated password display
  - Copy to clipboard functionality

- **Breach Checking UI**
  - Shows checking status
  - Displays breach results
  - Handles errors gracefully

### End-to-End Tests

#### Cypress E2E Tests (`passwordAnalyzer.cy.js`)
- **Password Analysis Flow**
  - Initial load with sample password
  - Weak password analysis
  - Fair password analysis
  - Good password analysis
  - Strong password analysis
  - Length bonuses
  - Common password penalties

- **User Interactions**
  - Password visibility toggle
  - Breach checking with real API
  - Password generation with various options
  - Copy to clipboard
  - Alert for invalid generator options

- **Responsive Design**
  - Mobile viewport testing
  - Tablet viewport testing
  - Layout adjustments

- **Accessibility**
  - Label associations
  - Keyboard navigation
  - Screen reader compatibility

## Test Commands Reference

### Custom Cypress Commands

- `cy.checkPasswordStrength(password, expectedStrength)` - Types a password and verifies the strength rating
- `cy.verifyCriteria(criteriaId, shouldBeMet)` - Checks if a specific criteria is met or not
- `cy.generatePasswordWithOptions(options)` - Generates a password with specific settings

## Coverage Thresholds

The project maintains the following coverage thresholds:
- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

## Debugging Tests

### Jest Tests
- Use `console.log()` in test files
- Run specific test file: `npm test -- passwordAnalyzer.test.js`
- Run specific test: `npm test -- -t "should calculate strength"`

### Cypress Tests
- Use `cy.pause()` to pause execution
- Use `cy.debug()` to enter debugger
- Use Chrome DevTools in interactive mode

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Clear Assertions**: Use descriptive test names and assertions
3. **Mock External Dependencies**: Mock API calls and browser APIs
4. **Test Edge Cases**: Include boundary conditions and error scenarios
5. **Maintain Test Data**: Use consistent test data across similar tests

## Future Improvements

1. Add performance tests for password generation
2. Add visual regression tests
3. Add accessibility testing with axe-core
4. Add API contract tests for breach checking
5. Add load testing for concurrent password checks