import * as React from 'react';
import NotificationsPage from '../notifications-page';

import { screen, renderWithAllProviders, act, genAppProps } from '@akashaorg/af-testing';

describe('< NotificationsPage /> component', () => {
  const BaseComponent = <NotificationsPage {...genAppProps()} />;
  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });

  it('should render notifications page', async () => {
    expect(
      screen.getByText(
        /Check out the latest development about the topics you are most interested in and people you care about./,
      ),
    ).toBeInTheDocument();
  });
});
