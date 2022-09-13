import { TIMEOUT } from '../utils/constants';
import { TopbarTest } from './partials/topbar.spec';
import { TrendingWidgetTest } from './partials/trendingWidget.spec';

describe('Profile Page', () => {
  context('Profile Page', () => {
    before(() => {
      cy.visit(
        '/@akashaorg/app-profile/bbaareihb5fdjg5ozj7d77tnjq2mexcktik3bwe3w7ds3yhgp335vupythi',
      );
    });
    describe('Should test top bar', () => TopbarTest());
    describe('Should test trending widget', () => TrendingWidgetTest());
    it('should open report popup on click', () => {
      cy.get('svg[type="moreDark"]', { timeout: TIMEOUT }).first().click();
    });
    it('should redirect to post page', () => {
      cy.get('svg[type="comments"]', { timeout: TIMEOUT }).first().click();
      cy.location('pathname').should('contain', '/post');
    });
    it('should open login modal on follow button click', () => {
      cy.get('[data-testid="duplex-button"]', { timeout: TIMEOUT }).first().click();
      cy.get('[data-testid="modal-card-login"]').should('be.visible');
    });
  });
});
