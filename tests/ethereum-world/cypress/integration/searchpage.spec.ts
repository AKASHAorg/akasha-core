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

  describe('Search Bar', () => {
    it('should work', () => {
      cy.get('#widget-akashaproject-ui-widget-topbar input').type('test');
    });
  });
});
