import React from 'react';
import SearchPage from '../pages/search-page';
import { screen, renderWithAllProviders, act, genAppProps } from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';

const mockLocationValue = {
  pathname: '/search/',
  search: '',
  hash: '',
  state: null,
};

const mockRouteParams = {
  searchKeyword: '',
};

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: jest.fn().mockImplementation(() => {
    return mockLocationValue;
  }),
  useParams: jest.fn().mockImplementation(() => {
    return mockRouteParams;
  }),
}));

describe('<SearchPage />', () => {
  const BaseComponent = (
    <AnalyticsProvider {...genAppProps()}>
      <SearchPage />
    </AnalyticsProvider>
  );
  beforeEach(async () => {
    await act(async () => {
      await renderWithAllProviders(BaseComponent, {});
    });
  });
  it('should render search page', () => {
    expect(screen.getByText(/Search/)).toBeInTheDocument();
  });
});
