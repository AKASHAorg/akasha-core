import { TIMEOUT } from '../utils/constants';

describe('Bookmarks Page', () => {
  context('Bookmarks Page', () => {
    before(() => {
      cy.visit('/@akashaorg/app-bookmarks');
    });

    it('should have bookmarks page visible', () => {
      cy.get('[data-testid="bookmarks"]', { timeout: TIMEOUT }).should('be.visible');
    });
  });
});
