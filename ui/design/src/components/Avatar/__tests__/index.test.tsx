import * as React from 'react';
import { act, cleanup, waitFor } from '@testing-library/react';

import Avatar, { getAvatarFromSeed } from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<Avatar /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(<Avatar ethAddress={'0x01230123450012312'} />),
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

  it('should generate SAME placeholder name for a given Eth Address (with guest={true})', async () => {
    const ethAddress = '0x12300ab456000ced9vAr130019mX24';
    const targetResult = getAvatarFromSeed(ethAddress);
    for (let i = 0; i < 10; i += 1) {
      const testAvatar = getAvatarFromSeed(ethAddress);
      expect(testAvatar).toEqual(targetResult);
    }
  });

  it('when not in guest mode, should load src prop', async () => {
    const { findByTestId } = componentWrapper;

    const src = '/images/avatar-placeholder-1.png';
    const image = await waitFor(() => findByTestId('avatar-image'));
    expect(image.getAttribute('src')).toEqual(src);
  });
});
