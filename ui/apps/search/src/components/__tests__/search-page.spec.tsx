import React from 'react';
import SearchPage from '../routes/search-page';
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
      <SearchPage
        loggedProfileData={{
          id: 'some id',
          createdAt: Date.now(),
          name: 'some name',
          did: { id: 'did:pkh' },
        }}
        showLoginModal={jest.fn()}
      />
    </AnalyticsProvider>
  );
  beforeEach(async () => {
    await act(async () => {
      await renderWithAllProviders(BaseComponent, {});
    });
  });
  it('should render search page', () => {
    expect(screen.getByText(/Start searching for something/)).toBeInTheDocument();
  });
});
