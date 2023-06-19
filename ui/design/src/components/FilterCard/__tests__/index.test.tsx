import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import FilterCard from '../';
import ProfileAvatarButton from '../../ProfileAvatarButton';
import { customRender, wrapWithTheme } from '../../../test-utils';
import userEvent from '@testing-library/user-event';
import { userData } from '../../../utils/dummy-data';

describe('<FilterCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const titleElement = (
    <ProfileAvatarButton
      avatarImage={userData[0].avatar}
      onClick={() => null}
      label="@ivacarter"
      info="ivacarter.akasha.eth"
      size="sm"
      profileId={'0x000000'}
    />
  );

  const handleClickAll = jest.fn();
  const handleClickFollowing = jest.fn();
  const handleClickLatest = jest.fn();
  const handleClickOldest = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <FilterCard
            titleElement={titleElement}
            handleClickAll={handleClickAll}
            handleClickFollowing={handleClickFollowing}
            handleClickLatest={handleClickLatest}
            handleClickOldest={handleClickOldest}
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

  it('has correct profile avatar', () => {
    const { getByTestId } = componentWrapper;
    const image = getByTestId('avatar-image');

    expect(image).toBeDefined();
    expect(image).toHaveAttribute('srcSet', 'https://placebeard.it/360x360');
  });

  it('has correct profile name and username', () => {
    const { getByText } = componentWrapper;
    const profileName = getByText('@ivacarter');
    const profileUsername = getByText('ivacarter.akasha.eth');

    expect(profileName).toBeDefined();
    expect(profileUsername).toBeDefined();
  });

  it('renders filters when clicked', async () => {
    const { getByText } = componentWrapper;

    // Filter button is present at this stage
    const filterButton = getByText('Filters');
    expect(filterButton).toBeDefined();

    await userEvent.click(filterButton);

    // after clicking, Close button replaces Filter button
    const closeButton = getByText('Close');
    expect(closeButton).toBeDefined();
    expect(closeButton).toBeDefined();
  });
});
