import * as React from 'react';
import Dashboard from '../dashboard';

import { renderWithAllProviders, screen, act, genAppProps } from '@akashaorg/af-testing';

describe('< Dashboard />', () => {
  const BaseComponent = <Dashboard {...genAppProps()} />;
  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });
  it('should render dashboard page', async () => {
    expect(screen.getByText(/Welcome to the Article App/i)).toBeInTheDocument();
  });
});
