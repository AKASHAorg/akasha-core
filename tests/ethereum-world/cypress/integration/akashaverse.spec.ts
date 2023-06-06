import { TIMEOUT } from '../utils/constants';

describe('AKASHAverse', () => {
  context('AKASHAverse', () => {
    before(() => {
      cy.visit('/@akashaorg/app-integration-center', { timeout: TIMEOUT });
    });

    it('should have AKASHAverse visible', () => {
      cy.get('[data-testid="akasha-verse"]', { timeout: TIMEOUT }).should('be.visible');
    });
  });
});
