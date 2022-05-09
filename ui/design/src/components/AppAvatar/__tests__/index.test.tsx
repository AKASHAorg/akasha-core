import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import { AppTypes } from '@akashaproject/ui-awf-typings';

import AppAvatar from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<AppAvatar /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(<AppAvatar ethAddress={'0x01230123450012312'} appType={AppTypes.APP} />),
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

  it('matches snapshot', () => {
    const { getByRole } = componentWrapper;

    const avatar = getByRole('img');
    expect(avatar).toHaveAttribute('src', expect.stringMatching(/app-placeholder/i));
  });
});
