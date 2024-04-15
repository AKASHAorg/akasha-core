import * as React from 'react';
import CustomiseNotificationPage from '../pages/customise-notification-page';
import { screen, renderWithAllProviders, act } from '@akashaorg/af-testing';

describe('< CustomiseNotificationPage /> component', () => {
  const BaseComponent = <CustomiseNotificationPage />;
  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });

  it("should render the notifications app's customization page", async () => {
    expect(screen.getByText(/Customise Your Notifications/)).toBeInTheDocument();
  });
});
