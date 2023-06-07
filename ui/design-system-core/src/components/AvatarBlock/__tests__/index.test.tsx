import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import AvatarBlock from '../';
import { customRender } from '../../../test-utils';

describe('<AvatarBlock /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const profile = {
    did: { id: 'did.id' },
    name: 'name',
    userName: 'username',
    avatar: {
      default: {
        height: 320,
        src: '',
        width: 320,
      },
    },
  };

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <AvatarBlock
          avatar={profile.avatar}
          profileId={profile.did.id}
          name={profile.name}
          userName={profile.userName}
        />,
        {},
      );
    });
  });

  afterEach(() => {
    act(() => componentWrapper.unmount());
    cleanup();
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('renders correct name and userName', () => {
    const { getByText } = componentWrapper;

    const name = getByText(profile.name);
    const userName = getByText(profile.userName);

    expect(name).toBeDefined();
    expect(userName).toBeDefined();
  });
});
