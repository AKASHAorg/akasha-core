import { TIMEOUT } from '../utils/constants';
import { TopbarTest } from './partials/topbar.spec';
import { TrendingWidgetTest } from './partials/trendingWidget.spec';

const pubKeyToVisit = 'bbaareib5zoznrhrgxlavhirucbnguagg243una7gy2i7x5jqjwrtdthkoe';

describe('Profile Page', () => {
  context('Profile Page', () => {
    before(() => {
      cy.visit(`/@akashaorg/app-profile/${pubKeyToVisit}`);
    });
    describe('Should test top bar', () => TopbarTest());
    describe('Should test trending widget', () => TrendingWidgetTest());
    it('should open report popup on click', () => {
      cy.get('svg[type="moreDark"]', { timeout: TIMEOUT }).click();
      cy.contains('Report').click();
      cy.get('[data-testid="modal-card-login"]', { timeout: TIMEOUT }).should('be.visible');
    });
    it('should redirect to feed profile page', () => {
      cy.visit(`/@akashaorg/app-profile/${pubKeyToVisit}`);
      cy.get('[data-testid="posts-button"]', { timeout: TIMEOUT }).first().click();
      cy.location('pathname').should('contain', `/profile-feed/${pubKeyToVisit}`);
    });
    it('should open login modal on follow button click', () => {
      cy.get('[data-testid="duplex-button"]', { timeout: TIMEOUT }).first().click();
      cy.get('[data-testid="modal-card-login"]', { timeout: TIMEOUT }).should('be.visible');
    });
  });
});
