import { TIMEOUT } from '../utils/constants';
import { TopbarTest } from './partials/topbar.spec';
import { TrendingWidgetTest } from './partials/trendingWidget.spec';

const profileToVisit = 'did:pkh:eip155:5:0x36c703c4d2fa2437dc883e2e0884e57404e16493';

describe('Profile Page', () => {
  context('Profile Page', () => {
    before(() => {
      cy.visit(`/@akashaorg/app-profile/${profileToVisit}`, { timeout: TIMEOUT });
    });
    describe('Should test top bar', () => TopbarTest());
    describe('Should test trending widget', () => TrendingWidgetTest());
    /* @TODO: change tests to reflect the new profile page design
    it('should open report popup on click', () => {
      cy.get('svg[type="moreDark"]', { timeout: TIMEOUT }).click();
      cy.contains('Report').click();
      cy.get('[data-testid="modal-card-login"]', { timeout: TIMEOUT }).should('be.visible');
    });
    it('should redirect to feed profile page', () => {
      cy.visit(`/@akashaorg/app-profile/${profileToVisit}`);
      cy.get('[data-testid="posts-button"]', { timeout: TIMEOUT }).first().click();
      cy.location('pathname').should('contain', `/profile-feed/${profileToVisit}`);
    });
    it('should open login modal on follow button click', () => {
      cy.get('[data-testid="duplex-button"]', { timeout: TIMEOUT }).first().click();
      cy.get('[data-testid="modal-card-login"]', { timeout: TIMEOUT }).should('be.visible');
    });
    */
  });
});
