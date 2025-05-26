describe('Password Security Analyzer E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Password Analysis', () => {
    it('should load with initial password and show analysis', () => {
      cy.get('#password').should('have.value', 'Password123!');
      cy.get('#strengthText').should('contain', 'Strong');
      cy.get('.strength-meter-fill').should('have.css', 'width').and('not.equal', '0px');
    });

    it('should analyze weak passwords correctly', () => {
      cy.checkPasswordStrength('123', 'Weak');
      cy.verifyCriteria('lengthCriteria', false);
      cy.verifyCriteria('uppercaseCriteria', false);
      cy.verifyCriteria('lowercaseCriteria', false);
      cy.verifyCriteria('numberCriteria', true);
      cy.verifyCriteria('specialCriteria', false);
    });

    it('should analyze fair passwords correctly', () => {
      cy.checkPasswordStrength('password', 'Fair');
      cy.verifyCriteria('lengthCriteria', true);
      cy.verifyCriteria('uppercaseCriteria', false);
      cy.verifyCriteria('lowercaseCriteria', true);
      cy.verifyCriteria('numberCriteria', false);
      cy.verifyCriteria('specialCriteria', false);
    });

    it('should analyze good passwords correctly', () => {
      cy.checkPasswordStrength('Password1', 'Good');
      cy.verifyCriteria('lengthCriteria', true);
      cy.verifyCriteria('uppercaseCriteria', true);
      cy.verifyCriteria('lowercaseCriteria', true);
      cy.verifyCriteria('numberCriteria', true);
      cy.verifyCriteria('specialCriteria', false);
    });

    it('should analyze strong passwords correctly', () => {
      cy.checkPasswordStrength('P@ssw0rd!', 'Strong');
      cy.verifyCriteria('lengthCriteria', true);
      cy.verifyCriteria('uppercaseCriteria', true);
      cy.verifyCriteria('lowercaseCriteria', true);
      cy.verifyCriteria('numberCriteria', true);
      cy.verifyCriteria('specialCriteria', true);
    });

    it('should give bonus for very long passwords', () => {
      cy.checkPasswordStrength('thisisaverylongpasswordwithmorethan16characters', 'Good');
      cy.get('.strength-meter-fill').should('have.css', 'width');
    });

    it('should penalize common passwords', () => {
      cy.checkPasswordStrength('password', 'Weak');
      cy.checkPasswordStrength('123456', 'Weak');
      cy.checkPasswordStrength('qwerty', 'Weak');
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility', () => {
      cy.get('#password').should('have.attr', 'type', 'password');
      cy.get('.toggle-password').should('contain', '👁️');
      
      cy.get('.toggle-password').click();
      cy.get('#password').should('have.attr', 'type', 'text');
      cy.get('.toggle-password').should('contain', '🙈');
      
      cy.get('.toggle-password').click();
      cy.get('#password').should('have.attr', 'type', 'password');
      cy.get('.toggle-password').should('contain', '👁️');
    });
  });

  describe('Breach Checking', () => {
    it('should check password breaches', () => {
      cy.get('#password').clear().type('password123');
      
      cy.get('#breachCheck', { timeout: 10000 }).should('be.visible');
      cy.get('#breachCheck').should('contain.text', 'breach');
    });

    it('should show checking status while checking', () => {
      cy.get('#password').clear().type('testpassword');
      
      cy.get('#breachCheck').should('be.visible');
      // The breach check should eventually complete
      cy.get('#breachCheck', { timeout: 10000 }).should('satisfy', ($el) => {
        const text = $el.text();
        return text.includes('found') || text.includes('not been found') || text.includes('Unable');
      });
    });
  });

  describe('Password Generator', () => {
    it('should update length display when slider changes', () => {
      cy.get('#lengthDisplay').should('contain', '16');
      
      cy.get('#lengthSlider').invoke('val', 24).trigger('input');
      cy.get('#lengthDisplay').should('contain', '24');
      
      cy.get('#lengthSlider').invoke('val', 8).trigger('input');
      cy.get('#lengthDisplay').should('contain', '8');
    });

    it('should generate password with all options enabled', () => {
      cy.generatePasswordWithOptions({ length: 20 });
      
      cy.get('#generatedPasswordContainer').should('be.visible');
      cy.get('#generatedPassword').invoke('text').should('have.length', 20);
      
      // Verify the generated password is also analyzed
      cy.get('#password').invoke('val').should('have.length', 20);
      cy.get('#strengthText').should('contain', 'Strong');
    });

    it('should generate password with only uppercase', () => {
      cy.generatePasswordWithOptions({
        length: 10,
        uppercase: true,
        lowercase: false,
        numbers: false,
        special: false
      });
      
      cy.get('#generatedPassword').invoke('text').should('match', /^[A-Z]+$/);
    });

    it('should generate password with only lowercase', () => {
      cy.generatePasswordWithOptions({
        length: 10,
        uppercase: false,
        lowercase: true,
        numbers: false,
        special: false
      });
      
      cy.get('#generatedPassword').invoke('text').should('match', /^[a-z]+$/);
    });

    it('should generate password with only numbers', () => {
      cy.generatePasswordWithOptions({
        length: 10,
        uppercase: false,
        lowercase: false,
        numbers: true,
        special: false
      });
      
      cy.get('#generatedPassword').invoke('text').should('match', /^[0-9]+$/);
    });

    it('should generate password with mixed options', () => {
      cy.generatePasswordWithOptions({
        length: 15,
        uppercase: true,
        lowercase: true,
        numbers: false,
        special: false
      });
      
      cy.get('#generatedPassword').invoke('text').then(password => {
        expect(password).to.have.length(15);
        expect(password).to.match(/^[A-Za-z]+$/);
      });
    });

    it('should show alert when no options selected', () => {
      cy.window().then(win => {
        cy.stub(win, 'alert');
      });
      
      cy.generatePasswordWithOptions({
        uppercase: false,
        lowercase: false,
        numbers: false,
        special: false
      });
      
      cy.window().its('alert').should('be.calledWith', 'Please select at least one character type!');
    });

    it('should copy generated password to clipboard', () => {
      cy.generatePasswordWithOptions({ length: 12 });
      
      cy.get('#generatedPassword').invoke('text').then(password => {
        cy.window().then(win => {
          cy.stub(win.navigator.clipboard, 'writeText').resolves();
          
          cy.get('.copy-button').click();
          
          cy.wrap(win.navigator.clipboard.writeText).should('be.calledWith', password);
          cy.get('#copyFeedback').should('have.class', 'show');
        });
      });
    });
  });

  describe('Responsive Design', () => {
    it('should be responsive on mobile devices', () => {
      cy.viewport('iphone-x');
      
      cy.get('.container').should('be.visible');
      cy.get('#password').should('be.visible');
      cy.get('.generator-options').should('be.visible');
      
      // Generator options should stack on mobile
      cy.get('.generator-options').should('have.css', 'grid-template-columns');
    });

    it('should be responsive on tablet devices', () => {
      cy.viewport('ipad-2');
      
      cy.get('.container').should('be.visible');
      cy.get('#password').should('be.visible');
      cy.get('.generator-options').should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for form inputs', () => {
      cy.get('label[for="password"]').should('contain', 'Enter Password to Analyze');
      cy.get('label[for="lengthSlider"]').should('contain', 'Password Length');
      cy.get('label[for="includeUppercase"]').should('contain', 'Uppercase');
      cy.get('label[for="includeLowercase"]').should('contain', 'Lowercase');
      cy.get('label[for="includeNumbers"]').should('contain', 'Numbers');
      cy.get('label[for="includeSpecial"]').should('contain', 'Special');
    });

    it('should be keyboard navigable', () => {
      cy.get('#password').focus();
      cy.focused().should('have.id', 'password');
      
      cy.tab();
      cy.focused().should('have.class', 'toggle-password');
      
      // Continue tabbing through interactive elements
      cy.tab();
      cy.focused().should('have.id', 'lengthSlider');
    });
  });
});