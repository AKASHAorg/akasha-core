import * as React from 'react';
import CustomizeNotificationPage from '../pages/customize-notification-page';

import { screen, renderWithAllProviders, act, genAppProps } from '@akashaorg/af-testing';

describe('< CustomizeNotificationPage /> component', () => {
  const BaseComponent = <CustomizeNotificationPage isLoggedIn={true} {...genAppProps()} />;
  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });

  it("should render the notifications app's customization page", async () => {
    expect(screen.getByText(/I want to receive all types of notifications/i)).toBeInTheDocument();
  });
});
