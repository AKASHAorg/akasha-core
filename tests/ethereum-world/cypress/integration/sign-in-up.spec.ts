import { LayoutWidgetFocused } from './partials/layout-widget.spec';

describe('SignIn/SignUp app', () => {
  context('Sign in', () => {
    before(() => {
      cy.visit('/sign-in');
    });
    describe('Should have focused plugin element', () => LayoutWidgetFocused());
  });
});
