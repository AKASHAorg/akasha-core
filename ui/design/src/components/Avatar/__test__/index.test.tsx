import '@testing-library/jest-dom/extend-expect';
import { cleanup, fireEvent, waitForElement } from '@testing-library/react';
import * as React from 'react';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import { createFile, customRender, delay, wrapWithTheme } from '../../../test-utils';
import { MockFileReader, WindowWithFileReader } from '../../../test-utils/mocks';
import Avatar, { getAvatarFromSeed } from '../avatar';
import AvatarImage from '../avatar-image';
import EditableAvatar from '../editable-avatar';

describe('<Avatar /> component', () => {
  let componentWrapper: ReactTestRenderer = create(<></>);
  beforeEach(() => {
    act(() => {
      componentWrapper = create(wrapWithTheme(<Avatar guest={true} src={'0x01230123450012312'} />));
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
    const src = 'http://placebeard.it/640/480';
    const { findByTestId } = customRender(<Avatar src={src} />, {});
    const image = await waitForElement(() => findByTestId('avatar-image'));
    expect(image.getAttribute('src')).toEqual(src);
  });
});

describe('<EditableAvatar /> Component', () => {
  let componentWrapper: ReactTestRenderer = create(<></>);
  const originalFileReader = FileReader;

  beforeEach(() => {
    (window as WindowWithFileReader).FileReader = MockFileReader;
    act(() => {
      componentWrapper = create(
        wrapWithTheme(
          <EditableAvatar guest={true} onChange={jest.fn()} src="0x1230am3421h3i14cvv21n4" />,
        ),
      );
    });
  });
  afterEach(() => {
    (window as WindowWithFileReader).FileReader = originalFileReader;
    act(() => {
      componentWrapper.unmount();
    });
    cleanup();
  });
  it('should match snapshot', async () => {
    // delay to allow avatar to mount the AvatarImage component
    await delay();
    expect(componentWrapper.toJSON()).toMatchSnapshot('editable-avatar');
  });
  it('should have 1 input type file', async () => {
    const { getAllByTestId } = customRender(
      <EditableAvatar onChange={jest.fn()} src="0x1230am3421h3i14cvv21n4" />,
      {},
    );
    const fileInput = await waitForElement(() => getAllByTestId('avatar-file-input'));
    expect(fileInput).toHaveLength(1);
    expect(fileInput[0].getAttribute('type')).toEqual('file');
  });
  it('should trigger onChange event when input is changed', async () => {
    const onChange = jest.fn();
    const { findByTestId } = customRender(
      <EditableAvatar onChange={onChange} src="0x1230am3421h3i14cvv21n4" />,
      {},
    );
    const fileInput = await waitForElement(() => findByTestId('avatar-file-input'));
    fireEvent.change(fileInput, { target: { file: createFile('test-file.png') } });
    expect(onChange).toBeCalledTimes(1);
  });
});
