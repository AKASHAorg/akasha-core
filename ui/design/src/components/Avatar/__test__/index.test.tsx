import '@testing-library/jest-dom/extend-expect';
import { cleanup, waitForElement } from '@testing-library/react';
import * as React from 'react';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import { customRender, delay, wrapWithTheme } from '../../../test-utils';
import Avatar, { getAvatarFromSeed } from '..';
import AvatarImage from '../avatar-image';

describe('<Avatar /> component', () => {
  let componentWrapper: ReactTestRenderer = create(<></>);
  beforeEach(() => {
    act(() => {
      componentWrapper = create(wrapWithTheme(<Avatar ethAddress={'0x01230123450012312'} />));
    });
  });

  afterEach(() => {
    act(() => {
      componentWrapper.unmount();
    });
    cleanup();
  });

  it('when in guest mode, should mount', () => {
    const root = componentWrapper.root;
    const avatarComp = root.findByType(Avatar);
    expect(avatarComp).toBeDefined();
  });

  it('when in guest mode, should match snapshot', async () => {
    await delay();
    expect(componentWrapper.toJSON()).toMatchSnapshot('avatar');
  });

  it('when in guest mode, should pass an image obj to AvatarImage', async () => {
    const avatarRoot = componentWrapper.root.findByType(Avatar);
    // this is required because the avatarImage may not be mounted yet.
    // this should be used whenever we see React.Suspense in use!
    await delay();
    const avatarImageRoot = avatarRoot.findByType(AvatarImage);
    const { image } = avatarImageRoot.props;
    const src = image.read();
    expect(src).toBeDefined();
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
    const src = 'https://placebeard.it/640/480';
    const { findByTestId } = customRender(
      <Avatar src={src} ethAddress={'0x01230123450012312'} />,
      {},
    );
    const image = await waitForElement(() => findByTestId('avatar-image'));
    expect(image.getAttribute('src')).toEqual(src);
  });
});
