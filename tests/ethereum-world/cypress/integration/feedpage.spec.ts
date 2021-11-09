import { TopbarTest } from './partials/topbar.spec';
import { TrendingWidgetTest } from './partials/trendingWidget.spec';

describe('Feed Page', () => {
  context('Feed Page', () => {
    before(() => {
      cy.visit('/social-app/feed');
    });
    describe('Should test top bar', () => TopbarTest());
    describe('Should test trending widget', () => TrendingWidgetTest());
  });

  describe('Posts', () => {
    it('should render posts on the page', () => {
      cy.get('a[href^="/social-app/post"]').its('length').should('be.gt', 0);
    });

    it('should render user avatars in posts', () => {
      cy.get('[data-testid="avatar-image"]')
        .first()
        .should('have.attr', 'src')
        .and('contain', 'https://');
    });

    it('should open report popup on click', () => {
      cy.get('svg[type="moreDark"]').first().click();
    });
  });
});
