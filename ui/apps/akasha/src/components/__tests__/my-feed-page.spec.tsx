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
  const BaseComponent = ({ loggedProfileData }) => (
    <MyFeedPage
      {...genAppProps()}
      loggedProfileData={loggedProfileData}
      showLoginModal={jest.fn()}
    />
  );

  beforeAll(() => {
    (
      jest.spyOn(hooks, 'useInfiniteCustomPosts') as unknown as jest.SpyInstance<{
        isFetching: boolean;
      }>
    ).mockReturnValue({ isFetching: false });
  });
  // @TODO fix after new hooks
  it.skip('should render my feed page for anonymous users', async () => {
    await act(async () => {
      renderWithAllProviders(<BaseComponent loggedProfileData={genLoggedUser()} />, {});
    });
    expect(screen.getByText(/Your customized view of AKASHA World/)).toBeInTheDocument();
  });

  it.skip('should render my feed for authenticated users', async () => {
    await act(async () => {
      renderWithAllProviders(
        <BaseComponent loggedProfileData={{ ...genLoggedUser(), totalFollowing: 10 }} />,
        {},
      );
    });
    expect(screen.getByText(/No Posts Yet/i)).toBeInTheDocument();
  });
});
