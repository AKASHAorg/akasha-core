export const TopbarTest = () => {
  it('test topbar component', () => {
    cy.get('#akashaorg-ui-widget-topbar').should('exist');
  });
};
