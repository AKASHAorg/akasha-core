import { TopbarTest } from './partials/topbar.spec';
import { TrendingWidgetTest } from './partials/trendingWidget.spec';

describe('Legal Pages', () => {
  context('Terms of Service Page', () => {
    before(() => {
      cy.visit('/@akashaorg/app-legal/terms-of-service');
    });

    describe('Should test top bar', () => TopbarTest());
    describe('Should test trending widget', () => TrendingWidgetTest());
    it('should have legal document visible', () => {
      cy.get('[data-testid="md-card"]', { timeout: 20000 }).should('be.visible');
    });
  });
  context('Terms of Use Page', () => {
    before(() => {
      cy.visit('/@akashaorg/app-legal/terms-of-use');
    });

    describe('Should test top bar', () => TopbarTest());
    describe('Should test trending widget', () => TrendingWidgetTest());
    it('should have legal document visible', () => {
      cy.get('[data-testid="md-card"]', { timeout: 20000 }).should('be.visible');
    });
  });
  context('Privacy Policy Page', () => {
    before(() => {
      cy.visit('/@akashaorg/app-legal/privacy-policy');
    });

    describe('Should test top bar', () => TopbarTest());
    describe('Should test trending widget', () => TrendingWidgetTest());
    it('should have legal document visible', () => {
      cy.get('[data-testid="md-card"]', { timeout: 20000 }).should('be.visible');
    });
  });
  context('Code of Conduct Page', () => {
    before(() => {
      cy.visit('/@akashaorg/app-legal/code-of-conduct');
    });

    describe('Should test top bar', () => TopbarTest());
    describe('Should test trending widget', () => TrendingWidgetTest());
    it('should have legal document visible', () => {
      cy.get('[data-testid="md-card"]', { timeout: 20000 }).should('be.visible');
    });
  });
  context('Developers Guideline Page', () => {
    before(() => {
      cy.visit('/@akashaorg/app-legal/developer-guidelines');
    });

    describe('Should test top bar', () => TopbarTest());
    describe('Should test trending widget', () => TrendingWidgetTest());
    it('should have legal document visible', () => {
      cy.get('[data-testid="md-card"]', { timeout: 20000 }).should('be.visible');
    });
  });
});
