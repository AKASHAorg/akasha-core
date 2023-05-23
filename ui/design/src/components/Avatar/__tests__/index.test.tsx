import * as React from 'react';
import { act, cleanup, waitFor } from '@testing-library/react';

import Avatar, { getAvatarFromSeed } from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

const avatarSrc = '/images/avatar-placeholder-1.webp';

describe('<Avatar /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <Avatar
            profileId={'did:0x01230123450012312'}
            avatar={{ default: { src: avatarSrc, width: 100, height: 100 } }}
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
    const image = await waitFor(() => findByTestId('avatar-image'));
    expect(image.getAttribute('srcSet')).toEqual(avatarSrc);
  });
});
