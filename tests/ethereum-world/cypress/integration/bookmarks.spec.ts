import { TIMEOUT } from '../utils/constants';

describe('Lists Page', () => {
  context('Lists Page', () => {
    before(() => {
      cy.visit('/@akashaorg/app-lists', { timeout: TIMEOUT });
    });

    it('should have lists page visible', () => {
      cy.get('[data-testid="lists"]', { timeout: TIMEOUT }).should('be.visible');
    });
  });
});
