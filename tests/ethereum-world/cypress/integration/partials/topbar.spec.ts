export const TopbarTest = () => {
  it('test topbar component', () => {
    cy.get('#akashaproject-ui-widget-topbar').should('exist');
  });
};
