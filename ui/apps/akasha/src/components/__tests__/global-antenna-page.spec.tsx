import React from 'react';
import GlobalAntennaPage from '../pages/global-antenna-page';

import { screen, renderWithAllProviders, genAppProps, genUser } from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';
import { act } from 'react-dom/test-utils';
class ResizeObserver {
  observe() {
    return;
  }
  unobserve() {
    return;
  }
  disconnect() {
    return;
  }
}
describe('< GlobalAntennaPage /> component', () => {
  global.ResizeObserver = ResizeObserver;
  const BaseComponent = ({ authenticatedProfile }) => (
    <AnalyticsProvider {...genAppProps()}>
      <GlobalAntennaPage authenticatedProfile={authenticatedProfile} />
    </AnalyticsProvider>
  );

  it.skip('should render feed page for anonymous users', async () => {
    await act(async () => {
      renderWithAllProviders(<BaseComponent authenticatedProfile={null} />, {});
    });
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it.skip('should render feed page for authenticated users', async () => {
    await act(async () => {
      renderWithAllProviders(
        <BaseComponent
          authenticatedProfile={genUser('pkh:eip155:5:0xc47a483494db8fe455ba29a53a7f75349dfc02ff')}
        />,
        {},
      );
    });
    expect(screen.getByText(/From Your Mind to the World/i)).toBeInTheDocument();
    expect(screen.getByText(/Start Beaming/i)).toBeInTheDocument();
  });
});
