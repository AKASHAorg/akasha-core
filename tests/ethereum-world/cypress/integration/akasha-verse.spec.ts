import { TIMEOUT } from '../utils/constants';

describe('AKASHAVerse', () => {
  context('AKASHAVerse', () => {
    before(() => {
      cy.visit('/@akashaorg/app-integration-center', { timeout: TIMEOUT });
    });

    it('should have akasha verse visible', () => {
      cy.get('[data-testid="akasha-verse"]', { timeout: TIMEOUT }).should('be.visible');
    });
  });
});
