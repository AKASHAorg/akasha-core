import { TIMEOUT } from '../utils/constants';
import { TopbarTest } from './partials/topbar.spec';
import { TrendingWidgetTest } from './partials/trendingWidget.spec';

describe('Tag Page', () => {
  context('Tag Page', () => {
    before(() => {
      cy.visit('/@akashaorg/app-akasha-integration/tags/test');
    });
    describe('Should test top bar', () => TopbarTest());
    describe('Should test trending widget', () => TrendingWidgetTest());

    it('should redirect to post page', () => {
      cy.get('svg[type="comments"]', { timeout: TIMEOUT }).first().click();
      cy.location('pathname').should('contain', '/post');
    });
    it('should redirect to profile page', () => {
      cy.visit('/@akashaorg/app-akasha-integration/tags/test');
      cy.get('[data-testid="avatar-image"]', { timeout: TIMEOUT }).first().click();
      cy.location('pathname').should('contain', '/app-profile');
    });
    /* @TODO: revisit the test when login modal works properly
    it('should open login modal on subscribe button click', () => {
      cy.visit('/@akashaorg/app-akasha-integration/tags/test');
      cy.get('[data-testid="duplex-button"]', { timeout: TIMEOUT }).first().click();
      cy.get('[data-testid="modal-card-login"]', { timeout: TIMEOUT }).should('be.visible');
    });
    */
  });
});
