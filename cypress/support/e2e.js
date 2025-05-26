// Cypress E2E support file

// Import commands
import './commands';

// Disable uncaught exception handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  return false;
});