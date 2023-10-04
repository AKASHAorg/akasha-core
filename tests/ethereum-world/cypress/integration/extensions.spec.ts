import { TIMEOUT } from '../utils/constants';

describe('Extensions-App', () => {
  context('Extensions-App', () => {
    before(() => {
      cy.visit('/@akashaorg/app-extensions', { timeout: TIMEOUT });
    });

    it('should have akasha verse visible', () => {
      cy.get('[data-testid="extensions"]', { timeout: TIMEOUT }).should('be.visible');
    });
  });
});
