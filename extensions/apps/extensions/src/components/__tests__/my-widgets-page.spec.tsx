import * as React from 'react';
import MyWidgetsPage from '../pages/my-widgets-page';

import { screen, renderWithAllProviders, act } from '@akashaorg/af-testing';

describe('< MyWidgetsPage /> component', () => {
  const BaseComponent = <MyWidgetsPage />;

  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });

  it('should render my widgets page', async () => {
    expect(screen.getByText(/Newest Widgets/i)).toBeInTheDocument();
  });
});
