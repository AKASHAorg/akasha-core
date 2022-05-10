export const TrendingWidgetTest = () => {
  it('test trending widget component', () => {
    cy.get('#akashaorg-ui-widget-trending').should.exist;
  });
};
