import React from 'react';
import SearchPage from '../routes/search-page';
import {
  screen,
  renderWithAllProviders,
  genLoggedInState,
  genAppProps,
  act,
} from '@akashaorg/af-testing';

const mockLocationValue = {
  pathname: '/search/grhfsdfk',
  search: '',
  hash: '',
  state: null,
};

const mockRouteParams = {
  searchKeyword: 'grhfsdfk',
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
    <SearchPage {...genAppProps()} loginState={genLoggedInState()} showLoginModal={jest.fn()} />
  );
  beforeEach(async () => {
    await act(() => {
      renderWithAllProviders(BaseComponent, {});
    });
  });
  it('should render search page', () => {
    expect(
      screen.getByText(
        /Search everything. Follow wonderful people. And subscribe to any and all topics that get your synapses firing./,
      ),
    ).toBeInTheDocument();
  });
});
