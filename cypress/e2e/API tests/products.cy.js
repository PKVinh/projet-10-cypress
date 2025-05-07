describe('Display specific product page', () => {
  it('Should return 200 for for each /products:id', () => {
    let productIds = []

    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/products`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      productIds = response.body   

      productIds.forEach((product) => {
        cy.request({
          method: 'GET',
          url: `${Cypress.env('apiUrl')}/products/${product.id}`,
          }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('id', product.id); 
          });
        });
    });
  });
});
 