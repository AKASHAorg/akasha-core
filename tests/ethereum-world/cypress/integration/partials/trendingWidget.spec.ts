import { TIMEOUT } from '../../utils/constants';

export const TrendingWidgetTest = () => {
  it('test trending widget component', () => {
    cy.get('#akashaorg-ui-widget-trending', { timeout: TIMEOUT }).should('exist');
  });
};
