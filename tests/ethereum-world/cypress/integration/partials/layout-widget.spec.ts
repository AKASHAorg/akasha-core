import { TIMEOUT } from '../../utils/constants';

const FOCUSED_PLUGIN_SLOT_ID = '#focused-plugin-slot';
export const LayoutWidgetFocused = () => {
  it('test layout widget focused (/sign-in and /sign-up) routes', () => {
    cy.get(FOCUSED_PLUGIN_SLOT_ID, { timeout: TIMEOUT }).should('exist');
  });
};
