import { TIMEOUT } from '../utils/constants';
import { TopbarTest } from './partials/topbar.spec';
import { TrendingWidgetTest } from './partials/trendingWidget.spec';
import { DismissableNotificationCard } from './partials/layout-widget.spec';

describe('Global Antenna Page', () => {
  context('Global Antenna Page', () => {
    beforeEach(() => {
      cy.visit('/@akashaorg/app-antenna/antenna', { timeout: TIMEOUT });
    });
    describe('Should test top bar', () => TopbarTest());
    describe('Should test trending widget', () => TrendingWidgetTest());
    describe('Should test dismissable notification card', () => DismissableNotificationCard());
    it('should redirect to profile page', () => {
      cy.get('[data-testid="entry-profile-detail"]', { timeout: TIMEOUT }).first().click();
      cy.location('pathname').should('contain', '/app-profile');
    });
  });

  describe('Posts', () => {
    it('should render posts on the page', () => {
      cy.get('a[href^="/@akashaorg/app-profile"]', { timeout: TIMEOUT })
        .its('length')
        .should('be.gt', 0);
    });

    it('should mount card actions right extension point', () => {
      cy.get('[id*="entry-card-actions-right"]', { timeout: TIMEOUT })
        .its('length')
        .should('be.gt', 0);
    });

    it('should mount bookmark button into card actions right extension point', () => {
      cy.get('[id*="entry-card-actions-right"]', { timeout: TIMEOUT })
        .children()
        .should('have.length.gt', 0);
    });

    it('should render user avatars in posts', () => {
      cy.get('[data-page-idx="0"] [data-testid="avatar-image"]', { timeout: TIMEOUT })
        .first()
        .should('have.attr', 'src')
        .and('not.be.empty');
    });

    /* @TODO: The test should be active when the kebab menu is functional right now the menu isn't working
    it('should open report popup on click', () => {
      cy.get('[data-testid="entry-kebab-menu"]', { timeout: TIMEOUT }).click();
    });

    */
  });
});
