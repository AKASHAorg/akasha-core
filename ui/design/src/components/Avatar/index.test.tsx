import * as React from 'react';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import { delay, wrapWithTheme } from '../../test-utils';
import Avatar, { getAvatarFromSeed } from './avatar';
import AvatarImage from './avatar-image';
import EditableAvatar from './editable-avatar';

describe('Avatar component', () => {
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
  });

  it('should mount', () => {
    const root = componentWrapper.root;
    const avatarComp = root.findByType(Avatar);
    expect(avatarComp).toBeDefined();
  });

  it('should match snapshot', async () => {
    await delay();
    expect(componentWrapper.toJSON()).toMatchSnapshot('avatar');
  });

  it('should pass an image obj to AvatarImage', async () => {
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
});

describe('Editable-Avatar Component', () => {
  let componentWrapper: ReactTestRenderer = create(<></>);
  beforeEach(() => {
    act(() => {
      componentWrapper = create(
        wrapWithTheme(
          <EditableAvatar guest={true} onChange={jest.fn()} src="0x1230am3421h3i14cvv21n4" />,
        ),
      );
    });
  });
  afterEach(() => {
    act(() => {
      componentWrapper.unmount();
    });
  });
  it('should mount', () => {
    const avatarComp = componentWrapper.root.findByType(EditableAvatar);
    expect(avatarComp).toBeDefined();
  });
  it('should match snapshot', async () => {
    // delay to allow avatar to mount the AvatarImage component
    await delay();
    expect(componentWrapper.toJSON()).toMatchSnapshot('editable-avatar');
  });
});
