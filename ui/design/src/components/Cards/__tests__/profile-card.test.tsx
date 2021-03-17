import { cleanup, fireEvent, waitForElement } from '@testing-library/react';
import * as React from 'react';
import { act, create } from 'react-test-renderer';
import { customRender, wrapWithTheme } from '../../../test-utils';
import ProfileCard from '../profile-cards/profile-card';

const mockProfileData = {
  ethAddress: '0x003410490050000320006570034567114572000',
  pubKey: 'bbabcbaa243103inr3u2mab3wivqjjq56kiuwcejcenvwzcmjilwnirecba',
  avatar: 'https://placebeard.it/480/480',
  coverImage: 'goldenrod',
  name: 'Gilbert The Bearded',
  userName: '@gilbert',
  description:
    'Product design @companyname. Main interests: User experience, Design processes, Project Managament. Author of This could be a book name, and Another Book. Love people, plants, words, and food.',
  followers: '15',
  following: '1876',
  apps: '12',
  profileType: 'user',
  vnd: {},
  default: [],
};

const createBaseComponent = (props: any) => (
  <ProfileCard
    handleShareClick={() => null}
    loggedEthAddress={null}
    profileData={mockProfileData}
    onClickFollowers={props.onClickFollowers}
    onClickFollowing={props.onClickFollowing}
    onClickPosts={props.onClickPosts}
    onChangeProfileData={props.onChangeProfileData}
    descriptionLabel="Description"
    followingLabel="Followings"
    followersLabel="Followers"
    postsLabel="Posts"
    shareProfileLabel="Share"
    editProfileLabel="Edit"
    cancelLabel="Cancel"
    saveChangesLabel="Save Changes"
    flagAsLabel="Report Profile"
    changeCoverImageLabel="Change Cover Image"
    flaggable={true}
    onEntryFlag={() => null}
    getProfileProvidersData={props.getProfileProvidersData}
    updateProfileLabel="Update Profile"
    changeENSLabel="Update Ethereum Name"
    onENSChangeClick={() => {
      /* not empty block */
    }}
    onUpdateClick={() => {
      /* not an empty block */
    }}
    hideENSButton={false}
  />
);

describe('<ProfileCard /> Component, (read mode)', () => {
  let componentWrapper = create(<></>);

  beforeEach(() => {
    act(() => {
      componentWrapper = create(
        wrapWithTheme(
          createBaseComponent({
            // tslint:disable-next-line: no-empty
            onClickFollowers: () => {},
            // tslint:disable-next-line: no-empty
            onClickFollowing: () => {},
            // tslint:disable-next-line: no-empty
            onClickPosts: () => {},
            // tslint:disable-next-line: no-empty
            onChangeProfileData: () => {},
          }),
        ),
      );
    });
  });

  afterEach(() => {
    act(() => {
      componentWrapper.unmount();
    });
    cleanup();
  });

  it('should mount without errors', () => {
    const root = componentWrapper.root;
    const profileCardComp = root.findByType(ProfileCard);
    expect(profileCardComp).toBeDefined();
  });

  it.skip('should match the snapshot', () => {
    expect(componentWrapper.toJSON()).toMatchSnapshot('profile-card');
  });

  it('should have one cover image, that is not editable', async () => {
    const { getAllByTestId } = customRender(createBaseComponent({}), {});
    const coverImages = await waitForElement(() => getAllByTestId('profile-card-cover-image'));
    expect(coverImages).toHaveLength(1);
    // expect(coverImages[0]).not.toHaveAttribute('type', 'file');
  });

  it.skip('should have an avatar, that is not editable', async () => {
    const { getAllByTestId } = customRender(createBaseComponent({}), {});
    const avatarImages = await waitForElement(() => getAllByTestId('avatar-image'));
    expect(avatarImages).toHaveLength(1);
  });

  it('should have followings and followers and posts buttons', async () => {
    const { findByTestId } = customRender(createBaseComponent({}), {});

    const followingButton = await waitForElement(() => findByTestId('following-button'));
    const followersButton = await waitForElement(() => findByTestId('followers-button'));
    const postsButton = await waitForElement(() => findByTestId('posts-button'));
    expect(followingButton).toBeDefined();
    expect(followersButton).toBeDefined();
    expect(postsButton).toBeDefined();
  });

  it('should call following and followers and posts button handlers', async () => {
    const onClickFollowersHandler = jest.fn();
    const onClickFollowingHandler = jest.fn();
    const onClickPostsHandler = jest.fn();

    const { findByTestId } = customRender(
      createBaseComponent({
        onClickFollowers: onClickFollowersHandler,
        onClickFollowing: onClickFollowingHandler,
        onClickPosts: onClickPostsHandler,
      }),
      {},
    );
    const followingButton = await waitForElement(() => findByTestId('following-button'));
    const followersButton = await waitForElement(() => findByTestId('followers-button'));
    const postsButton = await waitForElement(() => findByTestId('posts-button'));
    fireEvent.click(followingButton);
    fireEvent.click(followersButton);
    fireEvent.click(postsButton);
    expect(onClickFollowingHandler).toBeCalledTimes(1);
    expect(onClickFollowersHandler).toBeCalledTimes(1);
    expect(onClickPostsHandler).toBeCalledTimes(1);
  });
});
