import { TopbarTest } from './partials/topbar.spec';
import { TrendingWidgetTest } from './partials/trendingWidget.spec';

describe('Profile Page', () => {
  context('Profile Page', () => {
    before(() => {
      cy.visit('/profile/bbaareihb5fdjg5ozj7d77tnjq2mexcktik3bwe3w7ds3yhgp335vupythi');
    });
    describe('Should test top bar', () => TopbarTest());
    describe('Should test trending widget', () => TrendingWidgetTest());
    it('should open report popup on click', () => {
      cy.get('svg[type="moreDark"]', { timeout: 20000 }).first().click();
    });
    it('should redirect to post page', () => {
      cy.get('svg[type="comments"]', { timeout: 20000 }).first().click();
      cy.location('pathname').should('contain', '/post');
    });
    it('should open login modal on follow button click', () => {
      cy.get('[data-testid="duplex-button"]', { timeout: 20000 }).first().click();
      cy.get('[data-testid="modal-card-login"]').should('be.visible');
    });
  });
});
