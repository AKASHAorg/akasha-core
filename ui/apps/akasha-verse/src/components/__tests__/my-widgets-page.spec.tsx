import * as React from 'react';
import MyWidgetsPage from '../pages/my-widgets-page';

import { screen, renderWithAllProviders, act, genAppProps } from '@akashaorg/af-testing';

describe('< MyWidgetsPage /> component', () => {
  const BaseComponent = <MyWidgetsPage {...genAppProps()} />;

  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });

  it('should render my widgets page', async () => {
    expect(screen.getByText(/Newest Widgets/i)).toBeInTheDocument();
  });
});
