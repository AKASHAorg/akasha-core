export const TrendingWidgetTest = () => {
  it('test trending widget component', () => {
    cy.get('#akashaproject-ui-widget-trending').should.exist;
  });
};
