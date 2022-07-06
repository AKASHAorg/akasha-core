import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import MessageAppConvoHeader from '../';

import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<MessageAppConvoHeader /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const name = 'Estelle Collier';
  const username = 'estellecollier';

  const handleClickAvatar = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <MessageAppConvoHeader
            chatOwner={name}
            chatOwnerUsername={username}
            chatOwnerAvatar={{ url: 'https://placebeard.it/360x360' }}
            chatOwnerEthAddress="0x003410490050000320006570034567114572000"
            onClickAvatar={handleClickAvatar}
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

  it("has correct chat owner's details", () => {
    const { getByText } = componentWrapper;
    const chatOwner = getByText(name);
    const chatOwnerUsername = getByText(`@${username}`);

    expect(chatOwner).toBeDefined();
    expect(chatOwnerUsername).toBeDefined();
  });
});
