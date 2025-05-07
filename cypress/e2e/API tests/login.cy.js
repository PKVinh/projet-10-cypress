describe('API /login endpoint tests', () => {
  it('should return 200 with valid credentials', () => {
    cy.login("test2@test.fr", "testtest")
    .then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it('should return 401 with invalid credentials', () => {
    cy.login("invalid", "invalid")
    .then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it('should return 401 with empty fields', () => {
    cy.login("", "")
    .then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it('should return 401 with 40 characters fields', () => {
    const moreThanMaxLength = Cypress._.repeat("asdf", 10)
    cy.login(moreThanMaxLength, moreThanMaxLength)
    .then((response) => {
      expect(response.status).to.eq(401);
    });
  });
});