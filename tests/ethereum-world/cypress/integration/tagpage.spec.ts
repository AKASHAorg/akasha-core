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
      cy.get('svg[type="comments"]', { timeout: 20000 }).first().click();
      cy.location('pathname').should('contain', '/post');
    });
    it('should redirect to profile page', () => {
      cy.visit('/@akashaorg/app-akasha-integration/tags/test');
      cy.get('[data-testid="avatar-image"]', { timeout: 20000 }).first().click();
      cy.location('pathname').should('contain', '/app-profile');
    });
    it('should open login modal on subscribe button click', () => {
      cy.visit('/@akashaorg/app-akasha-integration/tags/test');
      cy.get('[data-testid="duplex-button"]', { timeout: 20000 }).first().click();
      cy.get('[data-testid="modal-card-login"]', { timeout: 20000 }).should('be.visible');
    });
  });
});
