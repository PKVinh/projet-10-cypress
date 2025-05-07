describe('API GET /orders endpoint tests', () => {
let authToken;

  before(() => {
    cy.login("test2@test.fr", "testtest")
    .then((response) => 
      {expect(response.status).to.eq(200);
      authToken = response.body.token; 
      });
  });
    
  it('Should return 401 when accessing /orders without authentication', () => {
    cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/orders`,
        failOnStatusCode: false, // Évite que Cypress arrête le test sur un code d'erreur
        }).then((response) => {
        expect(response.status).to.eq(401);
    });
  });
        
  it('Should return 200 when accessing /orders with authentication', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/orders`,
      headers: {
          Authorization: `Bearer ${authToken}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200); // Vérifie que l'accès est autorisé après login
      expect(response.body).to.have.property('orderLines').and.to.be.an('array'); // Vérifie que le panier s'affiche
    });
  });
          
  it('Should return cart list when accessing /orders with authentication', () => {
      const validProductId = 9; // ID d'un produit disponible
      const testQuantity = 2; // Quantité valide
    
      cy.request({
        method: 'PUT',
          url: `${Cypress.env('apiUrl')}/orders/add`,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: {
            product: validProductId,
            quantity: testQuantity,
          },
          failOnStatusCode: false,
          }).then((response) => {
            expect(response.status).to.eq(200);
        });
            
        cy.request({
            method: 'GET',
            url: `${Cypress.env('apiUrl')}/orders`,
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            }).then((response) => {
              expect(response.body).to.have.property('orderLines').and.to.be.an('array').with.length.greaterThan(0); // Vérifie que le panier s'affiche
        });
  });
});

describe('API POST /orders/add endpoint tests', () => {
let authToken;
const validProductId = 9; // ID d'un produit disponible
const outOfStockProductId = 3; // ID d'un produit en rupture de stock
const testQuantity = 2; // Quantité valide
    
  before(() => {
    // Se connecter et récupérer le token
    cy.login("test2@test.fr", "testtest")
    .then((response) => {
      expect(response.status).to.eq(200);
      authToken = response.body.token; 
    });
  });

  it('Should successfully add a product to the cart', () => {
    cy.request({
    method: 'PUT',
    url: `${Cypress.env('apiUrl')}/orders/add`,
    headers: {
        Authorization: `Bearer ${authToken}`,
    },
    body: {
        product: validProductId,
        quantity: testQuantity,
    },
    failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('orderLines').and.to.be.an('array').with.length.greaterThan(0);
    });
  });
    
  it('Should return 400 when adding a product with a negative quantity', () => {
    cy.request({
      method: 'PUT',
      url: `${Cypress.env('apiUrl')}/orders/add`,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: {
        product: validProductId,
        quantity: -1,
      },
      failOnStatusCode: false, 
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });
    
  it('Should return 400 when adding a product with a non-numeric quantity', () => {
    cy.request({
      method: 'PUT',
      url: `${Cypress.env('apiUrl')}/orders/add`,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: {
        product: validProductId,
        quantity: "abc",
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });
    
  it('Should return 400 when adding an out-of-stock product', () => {
    cy.request({
      method: 'PUT',
      url: `${Cypress.env('apiUrl')}/orders/add`,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: {
        product: outOfStockProductId,
        quantity: testQuantity,
      },
      failOnStatusCode: false,
      }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });
});