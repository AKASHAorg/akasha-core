import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import ChatAreaHeader from '..';

import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<ChatAreaHeader /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const name = 'Estelle Collier';
  const username = 'estellecollier';

  const handleClickAvatar = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <ChatAreaHeader
            name={name}
            userName={username}
            avatar={{ url: 'https://placebeard.it/360x360' }}
            ethAddress="0x003410490050000320006570034567114572000"
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
    const fullName = getByText(name);
    const userName = getByText(`@${username}`);

    expect(fullName).toBeDefined();
    expect(userName).toBeDefined();
  });
});
