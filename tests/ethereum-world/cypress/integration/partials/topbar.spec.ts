export const TopbarTest = () => {
  it('test topbar component', () => {
    cy.get('#widget-akashaproject-ui-widget-topbar').should.exist;
  });
};
