import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import { customRender } from '@akashaorg/design-system-core/lib/test-utils';

import ChatAreaHeader from '..';

describe('<ChatAreaHeader /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const name = 'Estelle Collier';

  const handleClickAvatar = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <ChatAreaHeader
          name={name}
          avatar={{ src: 'https://placebeard.it/360x360', width: 360, height: 360 }}
          did={{ id: '0x003410490050000320006570034567114572000' }}
          onClickAvatar={handleClickAvatar}
          transformSource={() => ({
            src: 'https://placebeard.it/360x360',
            width: 360,
            height: 360,
          })}
        />,

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

    expect(fullName).toBeDefined();
  });
});
