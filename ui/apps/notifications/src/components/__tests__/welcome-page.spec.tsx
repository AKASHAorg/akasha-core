import * as React from 'react';
import WelcomePage from '../pages/welcome-page';

import { screen, renderWithAllProviders, act } from '@akashaorg/af-testing';

describe('< WelcomePage /> component', () => {
  const BaseComponent = <WelcomePage finalStep={false} />;
  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });

  it("should render the notifications app's welcome page", async () => {
    expect(screen.getByText(/Uh-oh! You are not connected!/)).toBeInTheDocument();
  });
});
