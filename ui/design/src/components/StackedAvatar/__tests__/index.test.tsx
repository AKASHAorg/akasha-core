import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import StackedAvatar from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';
import { userData } from '../../../utils/dummy-data';

describe('<StackedAvatar /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const maxAvatars = 3;

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(<StackedAvatar userData={userData} maxAvatars={maxAvatars} />),
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

  it('has specified max number of avatars', () => {
    const { getAllByRole } = componentWrapper;

    const avatars = getAllByRole('img');
    expect(avatars.length).toEqual(maxAvatars);
  });
});
