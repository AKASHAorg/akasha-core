import { TIMEOUT } from '../utils/constants';

describe('Integration Center', () => {
  context('Integration Center', () => {
    before(() => {
      cy.visit('/@akashaorg/app-integration-center', { timeout: TIMEOUT });
    });

    it('should have integration center visible', () => {
      cy.get('[data-testid="akasha-verse"]', { timeout: TIMEOUT }).should('be.visible');
    });
  });
});
