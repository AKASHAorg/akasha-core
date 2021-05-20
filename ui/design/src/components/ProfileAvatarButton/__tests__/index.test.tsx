import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import ProfileAvatarButton from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';
import userEvent from '@testing-library/user-event';

describe('<ProfileAvatarButton /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleClick = jest.fn();
  const handleClickAvatar = jest.fn();
  const handleMouseEnter = jest.fn();
  const handleMouseLeave = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <ProfileAvatarButton
            ethAddress="0x000000"
            avatarImage="https://placebeard.it/360x360"
            label="AKASHA World"
            info="20 April 2021 | 15h30"
            size="lg"
            onClick={handleClick}
            onClickAvatar={handleClickAvatar}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
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

  it('has correct label', () => {
    const { getByText } = componentWrapper;

    const label = getByText('AKASHA World');
    expect(label).toBeDefined();
  });

  it('has an avatar with correct profile url', () => {
    const { getByRole } = componentWrapper;

    const avatar = getByRole('img');
    expect(avatar).toBeDefined();
    expect(avatar).toHaveAttribute('src', 'https://placebeard.it/360x360');
  });

  it('calls handler when clicked', () => {
    const { getByText } = componentWrapper;

    const button = getByText('AKASHA World');

    expect(handleClick).toHaveBeenCalledTimes(0);
    userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('calls handler when avatar is clicked', () => {
    const { getByRole } = componentWrapper;

    const avatar = getByRole('img');

    expect(handleClickAvatar).toHaveBeenCalledTimes(0);
    userEvent.click(avatar);
    expect(handleClickAvatar).toHaveBeenCalledTimes(1);
  });

  it('calls hover/unhover handlers', () => {
    const { getByText } = componentWrapper;

    const button = getByText('AKASHA World');

    userEvent.hover(button);
    expect(handleMouseEnter).toHaveBeenCalledTimes(2);
    userEvent.unhover(button);
    expect(handleMouseLeave).toHaveBeenCalledTimes(1);
  });
});
