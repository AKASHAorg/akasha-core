import * as React from 'react';
import CustomizeNotificationPage from '../pages/customize-notification-page';
import { screen, renderWithAllProviders, act } from '@akashaorg/af-testing';

describe('< CustomizeNotificationPage /> component', () => {
  const BaseComponent = <CustomizeNotificationPage isLoggedIn={true} />;
  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });

  it("should render the notifications app's customization page", async () => {
    expect(screen.getByText(/Customize Your Notifications/i)).toBeInTheDocument();
  });
});
