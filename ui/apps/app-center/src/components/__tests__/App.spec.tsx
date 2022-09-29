import * as React from 'react';
import App from '../App';

import { screen, renderWithAllProviders, act, genAppProps } from '@akashaorg/af-testing';

describe('<App /> component', () => {
  const BaseComponent = <App {...genAppProps()} />;
  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });

  it('should render app center page', async () => {
    expect(screen.getByText('Integration Center')).toBeInTheDocument();
  });
});
