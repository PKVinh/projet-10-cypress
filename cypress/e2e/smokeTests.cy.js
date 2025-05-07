describe('Login smoke tests', () => {
  const pages = [
    {
      name: 'login',
      prefix: 'login',
      fields: ['username', 'password']
    },

    {
      name: 'register',
      prefix: 'register',
      fields: ['firstname', 'lastname', 'email', 'password', "password-confirm"]
    }
  ];

  pages.forEach((page) => {
    describe(`Form ${page.name} Test`, () => {
      beforeEach(() => {
        cy.visit(`${Cypress.env('baseUrl')}/#/${page.name}`);
      });

      it(`fields from ${page.name} form should be visible`, () => {
        page.fields.forEach((field) => {
          cy.get(`input[data-cy="${page.prefix}-input-${field}"]`).should('be.visible');
        });

        cy.get(`button[data-cy="${page.prefix}-submit"]`).should('be.visible');
      });
    });
  });
});

describe('Products smoke tests', () => {
  before(() => {
    cy.visit(`${Cypress.env('baseUrl')}/#/login`);
  
    cy.intercept('POST', '/login', (req) => {
      req.reply({ statusCode: 200, body: { token: 'fakeToken' } });
    }).as('loginRequest');

    cy.get('[data-cy="login-input-username"]').type('test2@test.fr');
    cy.get('[data-cy="login-input-password"]').type('testtest');
    cy.get('[data-cy="login-submit"]').click();
    
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
  });
  
  it('Should display "Ajout au panier" button and stock for each product', () => {
    // Aller sur la page des produits
    cy.visit(`${Cypress.env('baseUrl')}/#/products`);

    // Tester chaque page produit de 3 à 10
    for (let id = 3; id <= 10; id++) {
      cy.visit(`${Cypress.env('baseUrl')}/#/products/${id}`);
      cy.get('p[data-cy="detail-product-stock"]').should('be.visible');
      cy.get('button[data-cy="detail-product-add"]').should('be.visible');
    }
  });
});
  
  