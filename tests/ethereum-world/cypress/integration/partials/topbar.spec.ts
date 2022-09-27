import { TIMEOUT } from '../../utils/constants';

export const TopbarTest = () => {
  it('test topbar component', () => {
    cy.get('#akashaorg-ui-widget-topbar', { timeout: TIMEOUT }).should('exist');
  });
};
