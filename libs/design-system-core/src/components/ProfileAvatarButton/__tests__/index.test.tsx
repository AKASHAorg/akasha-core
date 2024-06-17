import * as React from 'react';
import ProfileAvatarButton from '../';
import { act, fireEvent, screen } from '@testing-library/react';
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

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <ProfileAvatarButton
          label={label}
          avatar={avatar}
          profileId={profileId}
          onClick={handleClick}
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

    fireEvent.click(avatarBox.childNodes[0]);
  });

  it('calls info handlers', () => {
    const { getByTestId } = componentWrapper;

    const infoBox = getByTestId('info-box');
    expect(infoBox).toBeDefined();
    expect(handleClick).toBeCalledTimes(0);

    fireEvent.mouseEnter(infoBox);

    fireEvent.click(infoBox);
    expect(handleClick).toBeCalledTimes(1);

    fireEvent.mouseLeave(infoBox);
  });
});
