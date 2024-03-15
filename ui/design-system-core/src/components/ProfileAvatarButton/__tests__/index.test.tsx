import * as React from 'react';
import { act, fireEvent } from '@testing-library/react';
import ProfileAvatarButton from '../';
import { customRender } from '../../../test-utils';
import { truncateDid } from '../../../utils';

describe('<ProfileAvatarButton /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const label = 'label';

  const profileId = 'did:pkh:eip155:5:0xc47a483494db8fe455ba29a53a7f75349dfc02ff';

  const avatar = {
    height: 320,
    src: '',
    width: 320,
  };

  const handleClick = jest.fn(/** */);
  const handleClickAvatar = jest.fn(/** */);
  const handleMouseEnter = jest.fn(/** */);
  const handleMouseLeave = jest.fn(/** */);

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <ProfileAvatarButton
          label={label}
          avatar={avatar}
          profileId={profileId}
          onClick={handleClick}
          onClickAvatar={handleClickAvatar}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />,
        {},
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('shows info and label', () => {
    const { getByText } = componentWrapper;

    const profileIdText = getByText(truncateDid(profileId));
    const labelText = getByText(label);

    expect(profileIdText).toBeDefined();
    expect(labelText).toBeDefined();
  });

  it('calls avatar handler', () => {
    const { getByTestId } = componentWrapper;

    const avatarBox = getByTestId('avatar-box');
    expect(avatarBox.childNodes[0]).toBeDefined();
    expect(handleClickAvatar).toBeCalledTimes(0);

    fireEvent.click(avatarBox.childNodes[0]);

    expect(handleClickAvatar).toBeCalledTimes(1);
  });

  it('calls info handlers', () => {
    const { getByTestId } = componentWrapper;

    const infoBox = getByTestId('info-box');
    expect(infoBox).toBeDefined();
    expect(handleClick).toBeCalledTimes(0);
    expect(handleMouseEnter).toBeCalledTimes(0);
    expect(handleMouseLeave).toBeCalledTimes(0);

    fireEvent.mouseEnter(infoBox);
    expect(handleMouseEnter).toBeCalledTimes(1);

    fireEvent.click(infoBox);
    expect(handleClick).toBeCalledTimes(1);

    fireEvent.mouseLeave(infoBox);
    expect(handleMouseLeave).toBeCalledTimes(1);
  });
});
