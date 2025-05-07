describe('Order Placement Test', () => {
  beforeEach(() => {
    cy.session('Login', () => {
      cy.visit(`${Cypress.env('baseUrl')}/#/login`);
      cy.get('[data-cy="login-input-username"]').type('test2@test.fr');
      cy.get('[data-cy="login-input-password"]').type('testtest');
          
      cy.intercept('POST', `${Cypress.env('apiUrl')}/login`).as('loginRequest');

      cy.get('[data-cy="login-submit"]').click();

      cy.wait('@loginRequest').then((interception) => {
        const token = interception.response.body.token;

        expect(token).to.exist; // sécurité
        cy.window().then((win) => {
          win.localStorage.setItem('token', token);
          cy.log(token)
        }); 
      });
    });
  });

  it('should add a product to the cart', () => {
    let orderAmount = 1;
    let id = 3;
    let initialStock // Stock du produit avant ajout au panier
    let finalStock // Stock du produit après ajout au panier

    cy.intercept('GET', `${Cypress.env('apiUrl')}/products/${id}`).as('getProduct');
    cy.visit(`${Cypress.env('baseUrl')}/#/products/${id}`);
    cy.wait('@getProduct'); // Pour laisser le stock s'afficher

    // Récupération du stock
    cy.get('[data-cy="detail-product-stock"]') 
      .invoke('text')
      .then((text) => {
        const match = text.match(/-?\d+/);
        initialStock = match ? parseInt(match[0], 10) : null;   
        cy.log(initialStock)
      })
  
    cy.get('[data-cy="detail-product-quantity"]').clear().type(orderAmount);
    cy.get('[data-cy="detail-product-add"]').click();
    
    // Le produit s'affiche dans le panier
    cy.intercept('GET', `${Cypress.env('apiUrl')}/orders`).as('getOrders');
    cy.visit(`${Cypress.env('baseUrl')}/#/cart`); 
    cy.wait('@getOrders');

    cy.get('[data-cy="cart-line"]').should('exist');
    cy.get('[data-cy="cart-line-image"]').should('be.visible')
    cy.get('[data-cy="cart-line-name"]').should('be.visible')

    cy.get('[data-cy="cart-line-quantity"]').should('be.visible')
    cy.get('[data-cy="cart-line-total"]').should('be.visible')

    cy.intercept('GET', `${Cypress.env('apiUrl')}/products/${id}`).as('getProductAfterAdd');
    cy.visit(`${Cypress.env('baseUrl')}/#/products/${id}`);
    cy.wait('@getProductAfterAdd');

    cy.get('[data-cy="detail-product-stock"]')
    .invoke('text')
    .then((text) => {
      const finalMatch = text.match(/-?\d+/); // extrait le premier nombre trouvé
      finalStock = finalMatch ? parseFloat(finalMatch[0], 10) : null;  
      cy.log(finalStock)
      expect(finalStock).to.equal(initialStock - orderAmount);
    });

    //Vide le panier
    cy.intercept('GET', `${Cypress.env('apiUrl')}/orders`).as('getOrders');
    cy.visit(`${Cypress.env('baseUrl')}/#/cart`); 
    cy.wait('@getOrders');

    cy.intercept('DELETE', `${Cypress.env('apiUrl')}/orders/${id}/delete`).as('deleteOrders');
    cy.get('[data-cy="cart-line-delete"]').each((trashBtn) => {
      cy.wrap(trashBtn).click();
    });
    cy.wait('@deleteOrders');
    
    cy.get('[data-cy="cart-line-delete"]').should('not.exist')
  });

  // it('should remove a product to the cart', () => {
  //   cy.visit(`${Cypress.env('baseUrl')}/#/cart`);
  //   cy.get('[data-cy="cart-line-delete"]').first().click();

  //   cy.get('[data-cy="cart-line-image"]').should('not.exist')
  //   cy.get('[data-cy="cart-line-name"]').should('not.exist')
  //   cy.get('[data-cy="cart-line-quantity"]').should('not.exist')
  //   cy.get('[data-cy="cart-line-total"]').should('not.exist')
  // });

  it('should NOT add a out of stock product', () => {
    let outOfStockProduct = 3; //ID d'un produit en rupture

    cy.intercept('GET', `${Cypress.env('apiUrl')}/products/${outOfStockProduct}`).as('getProduct');
    cy.visit(`${Cypress.env('baseUrl')}/#/products/${outOfStockProduct}`);
    cy.wait('@getProduct');

    cy.get('[data-cy="detail-product-form"]').should('not.be.visible');
  });
  
  it('should NOT add a product to the cart with negative amount', () => {
    let negativeAmount = -1
  
    cy.visit(`${Cypress.env('baseUrl')}/#/products`);
      
    cy.get('[data-cy="product-link"]').last().click();
      
    cy.get('[data-cy="detail-product-quantity"]').clear().type(negativeAmount);
    cy.get('[data-cy="detail-product-add"]').click();

    cy.visit(`${Cypress.env('baseUrl')}/#/cart`);
    cy.get('[data-cy="cart-line"]').should('not.exist');
  });

  it('should NOT add a product to the cart with high amount', () => {
    let highAmount = 20
    
    cy.visit(`${Cypress.env('baseUrl')}/#/products`);
        
    cy.get('[data-cy="product-link"]').last().click();
        
    cy.get('[data-cy="detail-product-quantity"]').clear().type(highAmount);
    cy.get('[data-cy="detail-product-add"]').click();

    cy.intercept('GET', `${Cypress.env('apiUrl')}/orders`).as('getOrders');
    cy.visit(`${Cypress.env('baseUrl')}/#/cart`);
    cy.wait('@getOrders');

    cy.get('[data-cy="cart-line"]').should('not.exist');
  });
});
  