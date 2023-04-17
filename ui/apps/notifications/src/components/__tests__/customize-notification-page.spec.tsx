import * as React from 'react';
import CustomizeNotificationPage from '../newComponents/CustomizeNotificationPage';

import { screen, renderWithAllProviders, act, genAppProps } from '@akashaorg/af-testing';

describe('< CustomizeNotificationPage /> component', () => {
  const BaseComponent = <CustomizeNotificationPage {...genAppProps()} />;
  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });

  it("should render notifications app's welcome page", async () => {
    expect(screen.getByText(/I want to receive all types of notifications/i)).toBeInTheDocument();
  });
});
