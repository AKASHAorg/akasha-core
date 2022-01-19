import { TopbarTest } from './partials/topbar.spec';
import { TrendingWidgetTest } from './partials/trendingWidget.spec';

describe('Feed Page', () => {
  context('Feed Page', () => {
    before(() => {
      cy.visit('/social-app/feed');
    });
    describe('Should test top bar', () => TopbarTest());
    describe('Should test trending widget', () => TrendingWidgetTest());
    it('should redirect to profile page', () => {
      cy.get('[data-testid="avatar-image"]', { timeout: 20000 }).first().click();
      cy.location('pathname').should('contain', '/profile');
    });
  });

  describe('Posts', () => {
    it('should render posts on the page', () => {
      cy.get('a[href^="/social-app/post"]', { timeout: 20000 }).its('length').should('be.gt', 0);
    });

    it('should render user avatars in posts', () => {
      cy.get('[data-testid="avatar-image"]', { timeout: 20000 })
        .first()
        .should('have.attr', 'src')
        .and('not.be.empty');
    });

    it('should open report popup on click', () => {
      cy.get('svg[type="moreDark"]', { timeout: 20000 }).first().click();
    });

    it('should redirect to profile page', () => {
      cy.get('[data-testid="avatar-image"]').first().click();
      cy.location('pathname').should('contain', '/profile');
    });
  });
});
