import { cleanup, fireEvent, waitForElement } from '@testing-library/react';
import * as React from 'react';
import { act, create } from 'react-test-renderer';
import { customRender, wrapWithTheme } from '../../../test-utils';
import ProfileCard from '../profile-cards/profile-card';

const mockProfileData = {
  ethAddress: '0x003410490050000320006570034567114572000',
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
};

const createBaseComponent = (props: any) => (
  <ProfileCard
    profileData={mockProfileData}
    onClickApps={props.onClickApps}
    onClickFollowing={props.onClickFollowing}
    onChangeProfileData={props.onChangeProfileData}
    descriptionLabel="Description"
    actionsLabel="Popular Actions"
    followingLabel="Followings"
    appsLabel="Apps"
    usersLabel="Users"
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
    onENSChangeClick={() => {}}
    onUpdateClick={() => {}}
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
            onClickApps: () => {},
            // tslint:disable-next-line: no-empty
            onClickFollowing: () => {},
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

  it('should have followings and apps buttons', async () => {
    const { findByTestId } = customRender(createBaseComponent({}), {});

    const followingButton = await waitForElement(() => findByTestId('following-button'));
    const appsButton = await waitForElement(() => findByTestId('apps-button'));
    expect(followingButton).toBeDefined();
    expect(appsButton).toBeDefined();
  });

  it('should call following and apps button handlers', async () => {
    const onClickAppsHandler = jest.fn();
    const onClickFollowingHandler = jest.fn();

    const { findByTestId } = customRender(
      createBaseComponent({
        onClickApps: onClickAppsHandler,
        onClickFollowing: onClickFollowingHandler,
      }),
      {},
    );
    const followingButton = await waitForElement(() => findByTestId('following-button'));
    const appsButton = await waitForElement(() => findByTestId('apps-button'));
    fireEvent.click(followingButton);
    fireEvent.click(appsButton);
    expect(onClickFollowingHandler).toBeCalledTimes(1);
    expect(onClickAppsHandler).toBeCalledTimes(1);
  });
});
