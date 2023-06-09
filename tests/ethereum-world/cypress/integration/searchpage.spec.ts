import { TIMEOUT } from '../utils/constants';
import { TopbarTest } from './partials/topbar.spec';
import { TrendingWidgetTest } from './partials/trendingWidget.spec';

describe('Search Page', () => {
  context('Search Page', () => {
    before(() => {
      cy.visit('/@akashaorg/app-search/results', { timeout: TIMEOUT });
    });
    describe('Should test top bar', () => TopbarTest());
    describe('Should test trending widget', () => TrendingWidgetTest());

    it('should have search box visible', () => {
      cy.get('[data-testid="search-box"]', { timeout: TIMEOUT }).should('be.visible');
    });
  });
});
