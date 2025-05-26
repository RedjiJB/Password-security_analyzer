// Custom Cypress commands

// Command to check password strength
Cypress.Commands.add('checkPasswordStrength', (password, expectedStrength) => {
  cy.get('#password').clear().type(password);
  cy.get('#strengthText').should('contain', expectedStrength);
});

// Command to verify criteria status
Cypress.Commands.add('verifyCriteria', (criteriaId, shouldBeMet) => {
  const selector = `#${criteriaId} .criteria-icon`;
  if (shouldBeMet) {
    cy.get(selector)
      .should('have.class', 'criteria-met')
      .and('contain', '✓');
  } else {
    cy.get(selector)
      .should('have.class', 'criteria-not-met')
      .and('contain', '✗');
  }
});

// Command to generate password with specific options
Cypress.Commands.add('generatePasswordWithOptions', (options) => {
  const { length, uppercase, lowercase, numbers, special } = options;
  
  if (length) {
    cy.get('#lengthSlider').invoke('val', length).trigger('input');
  }
  
  if (uppercase !== undefined) {
    cy.get('#includeUppercase').then($el => {
      if ($el.prop('checked') !== uppercase) {
        cy.wrap($el).click();
      }
    });
  }
  
  if (lowercase !== undefined) {
    cy.get('#includeLowercase').then($el => {
      if ($el.prop('checked') !== lowercase) {
        cy.wrap($el).click();
      }
    });
  }
  
  if (numbers !== undefined) {
    cy.get('#includeNumbers').then($el => {
      if ($el.prop('checked') !== numbers) {
        cy.wrap($el).click();
      }
    });
  }
  
  if (special !== undefined) {
    cy.get('#includeSpecial').then($el => {
      if ($el.prop('checked') !== special) {
        cy.wrap($el).click();
      }
    });
  }
  
  cy.contains('Generate Secure Password').click();
});