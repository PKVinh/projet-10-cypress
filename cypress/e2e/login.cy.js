describe('Login Test', () => {
    beforeEach(() => {
      cy.visit(`${Cypress.env('baseUrl')}/#/login`);
    });
 
    it('Should display login form', () => {
      cy.get(`input[data-cy="login-input-username"]`).should('be.visible');
      cy.get(`input[data-cy="login-input-password"]`).should('be.visible');
      cy.get(`button[data-cy="login-submit"]`).should('be.visible');
    })

    it('Should fail to login with empty credentials', () => {
      cy.get('[data-cy="login-submit"]').click();
      cy.get('[data-cy="login-errors"]')
        .should('be.visible')
        .should('contain.text', 'Merci de remplir correctement tous les champs');
    });

    it('Should fail to login with incorrect credentials', () => {
      cy.get('[data-cy="login-input-username"]').type('wrongUser');
      cy.get('[data-cy="login-input-password"]').type('wrongPassword');
      cy.get('[data-cy="login-submit"]').click();

      cy.get('[data-cy="login-errors"]')
        .should('be.visible')
        .should('contain.text', 'Merci de remplir correctement tous les champs');
    });

    it('should login successfully with correct credentials', () => {
      cy.get('[data-cy="login-input-username"]').type('123@test.fr');
      cy.get('[data-cy="login-input-password"]').type('testtest');
      cy.get('[data-cy="login-submit"]').click();
      cy.get('[data-cy="nav-link-cart"]').should('be.visible')
    });
});
  