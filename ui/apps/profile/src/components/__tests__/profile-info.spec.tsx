import React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore-next-line
import ProfileInfoPage from '../pages/profile-info';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore-next-line
import withProfileHeader from '../../components/profile-header-hoc';

import userEvent from '@testing-library/user-event';
import * as hooks from '@akashaorg/ui-awf-hooks/lib/generated';

import { renderWithAllProviders, act, screen, genUser, waitFor } from '@akashaorg/af-testing';
import { Profile } from '@akashaorg/typings/lib/ui';
import { MemoryRouter as Router } from 'react-router-dom';
import { AkashaFollow } from '@akashaorg/typings/lib/sdk/graphql-types-new';

describe('< ProfileInfoPage />', () => {
  const navigateTo = jest.fn();

  const BaseComponent = (
    <Router initialEntries={['/@akashaorg/app-profile/']}>
      {withProfileHeader(<ProfileInfoPage showLoginModal={jest.fn()} />)({
        handleCopyFeedback: jest.fn(),
        navigateTo,
        navigateToModal: jest.fn(),
        showLoginModal: jest.fn(),
      })}
    </Router>
  );
  const profile = genUser();

  beforeEach(async () => {
    userEvent.setup();
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });

  beforeAll(() => {
    (
      jest.spyOn(hooks, 'useGetProfileByDidQuery') as unknown as jest.SpyInstance<{
        data: {
          isViewer: boolean;
          akashaProfile: Profile;
        };
        status: 'success' | 'error' | 'loading';
      }>
    ).mockReturnValue({ data: { isViewer: true, akashaProfile: profile }, status: 'success' });

    (
      jest.spyOn(hooks, 'useGetFollowDocumentsQuery') as unknown as jest.SpyInstance<{
        data: {
          isViewer: boolean;
          akashaFollowList: { edges: AkashaFollow[] };
        };
        status: 'success' | 'error' | 'loading';
      }>
    ).mockReturnValue({
      data: { isViewer: true, akashaFollowList: { edges: [] } },
      status: 'success',
    });
  });
  it('should render profile info page', async () => {
    expect(screen.getByTestId('avatar-image')).toBeInTheDocument();
  });

  it('should render profile header', async () => {
    expect(screen.getByTestId('avatar-image')).toBeInTheDocument();
    expect(screen.getByText(profile.name)).toBeInTheDocument();
    expect(screen.getByText('0xc47a...fc02ff')).toBeInTheDocument();
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
    expect(screen.getByText('0xc47a...fc02ff')).toBeInTheDocument();
  });

  // @TODO: fix test
  it.skip('should go to edit page when edit icon is clicked', async () => {
    await userEvent.click(screen.getByRole('button', { name: 'edit' }));
    await waitFor(() => expect(navigateTo).toHaveBeenCalled());
  });
});
