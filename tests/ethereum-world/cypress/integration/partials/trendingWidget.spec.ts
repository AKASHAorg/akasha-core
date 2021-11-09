export const TrendingWidgetTest = () => {
  it('test trending widget component', () => {
    cy.get('#widget-akashaproject-ui-widget-trending').should.exist;
  });
};
