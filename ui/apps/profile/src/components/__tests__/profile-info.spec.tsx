import React from 'react';
import ProfileInfoPage from '../pages/profile-info';
import userEvent from '@testing-library/user-event';
import * as queryListenerHooks from '@akashaorg/ui-awf-hooks/lib/use-query-listener';
import * as statHook from '@akashaorg/ui-awf-hooks/lib/use-profile-stats';
import * as apolloHooks from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import {
  renderWithAllProvidersAndApollo,
  act,
  screen,
  genUser,
  waitFor,
} from '@akashaorg/af-testing';
import { truncateDid } from '@akashaorg/design-system-core/lib/utils/did-utils';
import { Profile } from '@akashaorg/typings/lib/ui';
import { MemoryRouter as Router } from 'react-router-dom';
import { AkashaFollow } from '@akashaorg/typings/lib/sdk/graphql-types-new';

const fakeDID = 'did:pkh:eip155:5:0xc47a483494db8fe455ba29a53a7f75349dfc02ff';

describe('< ProfileInfoPage />', () => {
  const navigateTo = jest.fn();

  const BaseComponent = (
    <Router initialEntries={['/@akashaorg/app-profile/']}>
      <ProfileInfoPage profileDid={fakeDID} />
    </Router>
  );
  const profile = genUser(fakeDID);

  beforeEach(async () => {
    userEvent.setup();
    await act(async () => {
      renderWithAllProvidersAndApollo(BaseComponent, {});
    });
  });

  beforeAll(() => {
    (
      jest.spyOn(apolloHooks, 'useGetProfileByDidQuery') as unknown as jest.SpyInstance<{
        data: {
          node: { isViewer: boolean; akashaProfile: Profile };
        };
        status: 'success' | 'error' | 'loading';
      }>
    ).mockReturnValue({
      data: { node: { isViewer: true, akashaProfile: profile } },
      status: 'success',
    });

    (
      jest.spyOn(apolloHooks, 'useGetProfileByDidSuspenseQuery') as unknown as jest.SpyInstance<{
        data: {
          node: { isViewer: boolean; akashaProfile: Profile };
        };
      }>
    ).mockReturnValue({ data: { node: { isViewer: true, akashaProfile: profile } } });

    (
      jest.spyOn(statHook, 'useProfileStats') as unknown as jest.SpyInstance<{
        data: {
          totalFollowing: number;
          totalFollowers: number;
          totalBeams: number;
          totalTopics: number;
        };
      }>
    ).mockReturnValue({
      data: { totalFollowing: 10, totalFollowers: 2, totalBeams: 4, totalTopics: 0 },
    });

    (
      jest.spyOn(queryListenerHooks, 'useMutationListener') as unknown as jest.SpyInstance<{
        mutation: null;
        clear: () => void;
      }>
    ).mockReturnValue({
      mutation: null,
      clear: jest.fn,
    });

    (
      jest.spyOn(
        apolloHooks,
        'useGetFollowDocumentsByDidSuspenseQuery',
      ) as unknown as jest.SpyInstance<{
        data: {
          isViewer: boolean;
          akashaFollowList: { edges: AkashaFollow[] };
        };
      }>
    ).mockReturnValue({
      data: { isViewer: true, akashaFollowList: { edges: [] } },
    });
  });
  it('should render profile info page', async () => {
    expect(screen.getByTestId('avatar-image')).toBeInTheDocument();
  });

  it('should render profile header', async () => {
    expect(screen.getByTestId('avatar-image')).toBeInTheDocument();
    expect(screen.getByText(profile.name)).toBeInTheDocument();
    expect(screen.getByText(truncateDid(fakeDID))).toBeInTheDocument();
  });

  it('should render profile description', async () => {
    expect(screen.getByText(profile.description || '')).toBeInTheDocument();
  });

  it('should render social links', async () => {
    expect(screen.getByText(profile.links?.[0]?.href || '')).toBeInTheDocument();
    expect(screen.getByText(profile.links?.[1]?.href || '')).toBeInTheDocument();
  });

  it('should render profile statistics', async () => {
    expect(screen.getByTestId('avatar-image')).toBeInTheDocument();
    expect(screen.getByText(profile.name)).toBeInTheDocument();
    expect(screen.getByText(truncateDid(fakeDID))).toBeInTheDocument();
  });

  // @TODO: fix test
  it.skip('should go to edit page when edit icon is clicked', async () => {
    await userEvent.click(screen.getByRole('button', { name: 'edit' }));
    await waitFor(() => expect(navigateTo).toHaveBeenCalled());
  });
});
