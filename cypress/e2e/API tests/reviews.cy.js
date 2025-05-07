describe('API /reviews endpoint tests', () => { 
  let authToken;
  before(() => {
  cy.login("test2@test.fr", "testtest")
  .then((response) => {
      expect(response.status).to.eq(200);
      authToken = response.body.token; 
    });
  });


  it('Should successfully add a review', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/reviews`,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: {
        title: "Super produit",
        comment: "J'ai adoré ce produit, très bonne qualité !",
        rating: 5,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  const invalidCases = [
    { title: "", comment: "Texte valide", rating: 4, reason: "empty title" },
    { title: "Bon produit", comment: "", rating: 4, reason: "empty comment" },
    { title: "Bon produit", comment: "Texte valide", rating: "", reason: "empty rating" },
    { title: "Bon produit", comment: "Texte valide", rating: 0, reason: "rating below range" },
    { title: "Bon produit", comment: "Texte valide", rating: 6, reason: "rating above range" }
  ];

  invalidCases.forEach(({ title, comment, rating, reason }) => {
    it(`Should return 400 when adding a review with ${reason}`, () => {
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/reviews`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: { title, comment, rating },
        failOnStatusCode: false, // Empêche Cypress d'arrêter sur une erreur HTTP
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });
});