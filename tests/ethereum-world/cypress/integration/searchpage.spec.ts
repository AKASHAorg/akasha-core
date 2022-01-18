import { TopbarTest } from './partials/topbar.spec';
import { TrendingWidgetTest } from './partials/trendingWidget.spec';

describe('Search Page', () => {
  context('Search Page', () => {
    before(() => {
      cy.visit('/search');
    });
    describe('Should test top bar', () => TopbarTest());
    describe('Should test trending widget', () => TrendingWidgetTest());
  });

  describe('Search Bar', () => {
    it('should work typing in the search input', () => {
      cy.get('#widget-akashaproject-ui-widget-topbar input')
        .type('test')
        .should('have.value', 'test');
    });
  });
});
