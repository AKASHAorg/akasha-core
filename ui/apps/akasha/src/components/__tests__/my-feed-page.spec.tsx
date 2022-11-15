import * as React from 'react';
import MyFeedPage from '../my-feed-page/my-feed-page';
import * as hooks from '@akashaorg/ui-awf-hooks/lib/use-posts';

import {
  screen,
  renderWithAllProviders,
  genAppProps,
  genLoggedInState,
  genLoggedUser,
} from '@akashaorg/af-testing';
import { act } from 'react-dom/test-utils';

describe('< MyFeedPage /> component', () => {
  const BaseComponent = ({ loggedProfileData, loginState }) => (
    <MyFeedPage
      {...genAppProps()}
      loggedProfileData={loggedProfileData}
      showLoginModal={jest.fn()}
      loginState={loginState}
    />
  );

  beforeAll(() => {
    (
      jest.spyOn(hooks, 'useInfiniteCustomPosts') as unknown as jest.SpyInstance<{
        isFetching: boolean;
      }>
    ).mockReturnValue({ isFetching: false });
  });

  it('should render my feed page for anonymous users', async () => {
    await act(async () => {
      renderWithAllProviders(
        <BaseComponent
          loggedProfileData={genLoggedUser()}
          loginState={{ isReady: false, pubKey: null, ethAddress: null }}
        />,
        {},
      );
    });
    expect(screen.getByText(/Your customized view of Ethereum World/)).toBeInTheDocument();
  });

  it('should render my feed for authenticated users', async () => {
    await act(async () => {
      renderWithAllProviders(
        <BaseComponent
          loggedProfileData={{ ...genLoggedUser(), totalFollowing: 10 }}
          loginState={genLoggedInState()}
        />,
        {},
      );
    });
    expect(screen.getByText(/No Posts Yet/i)).toBeInTheDocument();
  });
});
