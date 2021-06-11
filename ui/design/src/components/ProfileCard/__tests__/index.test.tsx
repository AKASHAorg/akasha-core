import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ProfileCard from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

import {
  aboutMeLabel,
  cancelLabel,
  changeCoverImageLabel,
  editProfileLabel,
  followersLabel,
  followingLabel,
  postsLabel,
  profileData,
  profileProvidersData,
  saveChangesLabel,
  shareProfileLabel,
} from '../../../utils/dummy-data';

describe('<ProfileCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleClickFollowers = jest.fn();
  const handleClickFollowing = jest.fn();
  const handleClickPosts = jest.fn();
  const handleClickProfileData = jest.fn();
  const handleEntryFlag = jest.fn();
  const handleGetProfileProvidersData = jest.fn();
  const handleUpdateClick = jest.fn();
  const handleENSChangeClick = jest.fn();
  const handleShareClick = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <ProfileCard
            profileData={profileData}
            descriptionLabel={aboutMeLabel}
            followingLabel={followingLabel}
            followersLabel={followersLabel}
            postsLabel={postsLabel}
            shareProfileLabel={shareProfileLabel}
            editProfileLabel={editProfileLabel}
            profileProvidersData={profileProvidersData}
            changeCoverImageLabel={changeCoverImageLabel}
            cancelLabel={cancelLabel}
            saveChangesLabel={saveChangesLabel}
            flaggable={true}
            onClickFollowers={handleClickFollowers}
            onClickFollowing={handleClickFollowing}
            onClickPosts={handleClickPosts}
            onChangeProfileData={handleClickProfileData}
            onEntryFlag={handleEntryFlag}
            getProfileProvidersData={handleGetProfileProvidersData}
            onUpdateClick={handleUpdateClick}
            onENSChangeClick={handleENSChangeClick}
            handleShareClick={handleShareClick}
          />,
        ),
        {},
      );
    });
  });

  afterEach(() => {
    act(() => componentWrapper.unmount());
    cleanup();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('has correct author name', () => {
    const { getByText } = componentWrapper;
    const authorName = getByText(/Gilbert The Bearded/i);

    expect(authorName).toBeDefined();
  });

  it('has a cover image', () => {
    const { getByTestId } = componentWrapper;
    const coverImage = getByTestId('profile-card-cover-image');

    expect(coverImage).toBeDefined();
  });

  it('has an avatar', () => {
    const { getByTestId } = componentWrapper;
    const avatarImage = getByTestId('avatar-image');

    expect(avatarImage).toBeDefined();
    expect(avatarImage).toHaveAttribute('src', 'https://placebeard.it/480/480');
  });

  it('has followings, followers, posts buttons', () => {
    const { getByTestId } = componentWrapper;
    const followersButton = getByTestId('followers-button');
    const followingButton = getByTestId('following-button');
    const postsButton = getByTestId('posts-button');

    expect(followersButton).toBeDefined();
    expect(followingButton).toBeDefined();
    expect(postsButton).toBeDefined();
  });

  it('calls handlers on followings, followers, posts buttons', () => {
    const { getByTestId } = componentWrapper;
    const followersButton = getByTestId('followers-button');
    const followingButton = getByTestId('following-button');
    const postsButton = getByTestId('posts-button');

    // test click actions
    userEvent.click(followersButton);
    userEvent.click(followingButton);
    userEvent.click(postsButton);

    expect(handleClickFollowers).toBeCalledTimes(1);
    expect(handleClickFollowing).toBeCalledTimes(1);
    expect(handleClickPosts).toBeCalledTimes(1);
  });
});
