import * as React from 'react';

import { act, cleanup } from '@testing-library/react';
import { Moderator } from '@akashaorg/typings/ui';

import ModeratorDetailCard from '..';
import { customRender, wrapWithTheme } from '../../../test-utils';

const moderator: Moderator = {
  _id: 'bbaareie6w5f2l6b4kpysopls6n4nuejbcyjrzwf7wcjpi3hg',
  _mod: new Date(),
  creationDate: new Date(),
  admin: true,
  active: true,
  coverImage: '',
  pubKey: 'bbaareie6w5f2l6b4kpysopls6n4nuejbcyjrzwf7wcjpi3hg',
  ethAddress: '',
  name: 'Isabel Milkovic',
  userName: 'isabelmilkovic',
  avatar: {
    url: '',
    fallbackUrl: '',
  },
  status: 'active',
  social: { discord: 'isabelmilkovic', email: 'isabel.milkovic@akasha.world' },
};

describe('<ModeratorDetailCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleSocialLinkClick = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <ModeratorDetailCard
            moderator={moderator}
            hasBorderBottom={false}
            tenureInfoLabel="Moderator since"
            onSocialLinkClick={handleSocialLinkClick}
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

  it('renders correct name and username', () => {
    const { getByText } = componentWrapper;
    const name = getByText(moderator.name);
    const username = getByText(`@${moderator.userName}`);

    expect(name).toBeDefined();
    expect(username).toBeDefined();
  });
});
