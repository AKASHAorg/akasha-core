import { TIMEOUT } from '../utils/constants';
import { TopbarTest } from './partials/topbar.spec';
import { TrendingWidgetTest } from './partials/trendingWidget.spec';

describe('Feed Page', () => {
  context('Feed Page', () => {
    beforeEach(() => {
      cy.visit('/@akashaorg/app-akasha-integration/feed');
    });
    describe('Should test top bar', () => TopbarTest());
    describe('Should test trending widget', () => TrendingWidgetTest());
    it('should redirect to profile page', () => {
      cy.get('[data-page-idx="0"] [data-testid="avatar-image"]', { timeout: TIMEOUT })
        .first()
        .click();
      cy.location('pathname').should('contain', '/app-profile');
    });
  });

  describe('Posts', () => {
    it('should render posts on the page', () => {
      cy.get('a[href^="/@akashaorg/app-profile"]', { timeout: TIMEOUT })
        .its('length')
        .should('be.gt', 0);
    });

    it('should render user avatars in posts', () => {
      cy.get('[data-page-idx="0"] [data-testid="avatar-image"]', { timeout: TIMEOUT })
        .first()
        .should('have.attr', 'src')
        .and('not.be.empty');
    });

    it('should open report popup on click', () => {
      cy.get('svg[type="moreDark"]', { timeout: TIMEOUT }).first().click();
    });
  });
});
