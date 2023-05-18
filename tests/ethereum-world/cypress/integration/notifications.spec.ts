import { TIMEOUT } from '../utils/constants';

describe('Notifications Page', () => {
  context('Notifications Page', () => {
    before(() => {
      cy.visit('/@akashaorg/app-notifications', { timeout: TIMEOUT });
    });

    it('should have notifications page visible', () => {
      cy.get('[data-testid="notifications"]', { timeout: TIMEOUT }).should('be.visible');
    });
  });
});
