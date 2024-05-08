import { TIMEOUT } from '../../utils/constants';

const FOCUSED_PLUGIN_SLOT_ID = '#focused-plugin-slot';
export const LayoutWidgetFocused = () => {
  it('test layout widget focused (/sign-in and /sign-up) routes', () => {
    cy.get(FOCUSED_PLUGIN_SLOT_ID, { timeout: TIMEOUT }).should('exist');
  });
};

export const DismissableNotificationCard = () => {
  it('should display the merge notification', () => {
    cy.get('[data-testid="the-merge-notification"]', { timeout: TIMEOUT }).should('exist');
  });
  it('should close the merge notification when button clicked', () => {
    cy.get('[aria-label="close"]', { timeout: TIMEOUT }).first().click();
    cy.get('[data-testid="the-merge-notification"]', { timeout: TIMEOUT }).should('not.exist');
  });
  it('should not display the merge notification on next visit', () => {
    // TODO: Right now the call to graphql api fails when revisiting feed page once it's resolved uncomment the line below
    // cy.visit('/@akashaorg/app-antenna/feed');
    cy.get('[data-testid="the-merge-notification"]', { timeout: TIMEOUT }).should('not.exist');
  });
};
