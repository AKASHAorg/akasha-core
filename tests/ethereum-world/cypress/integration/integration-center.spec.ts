import { TIMEOUT } from '../utils/constants';

describe('Integration Center', () => {
  context('Integration Center', () => {
    before(() => {
      cy.visit('/@akashaorg/app-integration-center');
    });

    it('should have integration center visible', () => {
      cy.get('[data-testid="integration-center"]', { timeout: TIMEOUT }).should('be.visible');
    });
  });
});
