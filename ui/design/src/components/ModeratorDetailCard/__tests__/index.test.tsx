import * as React from 'react';

import { act, cleanup } from '@testing-library/react';
import { IModeratorInfo } from '@akashaorg/typings/ui';

import ModeratorDetailCard from '..';
import { customRender, wrapWithTheme } from '../../../test-utils';

const moderator: IModeratorInfo = {
  name: 'Isabel Milkovic',
  username: 'isabelmilkovic',
  avatar: {
    url: '',
    fallbackUrl: '',
  },
  moderatorStartDate: '2020-10-01T00:00:00.000Z',
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
    const username = getByText(`@${moderator.username}`);

    expect(name).toBeDefined();
    expect(username).toBeDefined();
  });
});
