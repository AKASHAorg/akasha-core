before(() => {
  cy.visit('/social-app/feed');
  cy.wait(60000);
});
