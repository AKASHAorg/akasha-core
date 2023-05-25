import * as React from 'react';

import { act, cleanup } from '@testing-library/react';
import { Moderator } from '@akashaorg/typings/ui';

import ModeratorDetailCard from '..';
import { customRender, wrapWithTheme } from '../../../test-utils';

const moderator: Moderator = {
  id: 'pi3hg',
  createdAt: new Date(),
  admin: true,
  active: true,
  background: { default: { src: '', width: 0, height: 0 } },
  did: { id: 'bbaareie6w5f2l6b4kpysopls6n4nuejbcyjrzwf7wcjpi3hg' },
  name: 'Isabel Milkovic',
  avatar: {
    default: {
      src: '',
      width: 0,
      height: 0,
    },
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

    expect(name).toBeDefined();
  });
});
