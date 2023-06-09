import { TIMEOUT } from '../utils/constants';

describe('SignIn/SignUp app', () => {
  context('Sign in', () => {
    before(() => {
      cy.visit('/@akashaorg/app-auth-ewa', { timeout: TIMEOUT });
    });

    it('should have wallets list visible', () => {
      cy.get('[data-testid="providers-list"]', { timeout: TIMEOUT }).should('be.visible');
    });
  });
});
