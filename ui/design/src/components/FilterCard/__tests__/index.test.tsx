import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import FilterCard from '../';
import ProfileAvatarButton from '../../ProfileAvatarButton';
import { customRender, wrapWithTheme } from '../../../test-utils';
import userEvent from '@testing-library/user-event';

describe('<FilterCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const titleElement = (
    <ProfileAvatarButton
      avatarImage="https://placebeard.it/360x360"
      onClick={() => null}
      label="@ivacarter"
      info="ivacarter.akasha.eth"
      size="sm"
      ethAddress={'0x000000'}
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
    const { getByRole } = componentWrapper;
    const image = getByRole('img');

    expect(image).toBeDefined();
    expect(image).toHaveAttribute('src', 'https://placebeard.it/360x360');
  });

  it('has correct profile name and username', () => {
    const { getByText } = componentWrapper;
    const profileName = getByText('@ivacarter');
    const profileUsername = getByText('ivacarter.akasha.eth');

    expect(profileName).toBeDefined();
    expect(profileUsername).toBeDefined();
  });

  it('renders filters when clicked', () => {
    const { getByText } = componentWrapper;

    // Filter button is present at this stage
    const filterButton = getByText('Filters');
    expect(filterButton).toBeDefined();

    userEvent.click(filterButton);

    // after clicking, Close button replaces Filter button
    const closeButton = getByText('Close');
    expect(closeButton).toBeDefined();
    expect(closeButton).toBeDefined();
  });
});
