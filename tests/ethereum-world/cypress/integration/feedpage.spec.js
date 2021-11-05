import { TopbarTest } from './partials/topbar.spec';

describe('Feed Page', () => {
  context('Feed Page', () => {
    before(() => {
      cy.visit('/social-app/feed');
    });
    describe('Should test top bar', () => {
      TopbarTest();
    });
  });
});
