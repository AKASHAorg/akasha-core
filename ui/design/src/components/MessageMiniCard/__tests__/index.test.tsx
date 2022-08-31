import * as React from 'react';
import { act, cleanup, fireEvent } from '@testing-library/react';

import MessageAppMiniCard from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<MessageAppMiniCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleClickCard = jest.fn();
  const handleClickAvatar = jest.fn();
  const handleConvoPin = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <MessageAppMiniCard
            locale="en"
            senderName="Jerry Mil"
            senderUsername="jerrbear"
            content="Hello Jerry I hope you're good and having a great day?"
            isRead={true}
            isPinned={false}
            pinConvoLabel="Pin"
            unpinConvoLabel="Unpin"
            senderAvatar={{ url: 'https://placebeard.it/360x360' }}
            senderEthAddress="0x003410490050000320006570034567114572000"
            onClickCard={handleClickCard}
            onClickAvatar={handleClickAvatar}
            onConvoPin={handleConvoPin}
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

  it('has correct sender name', () => {
    const { getByText } = componentWrapper;
    const title = getByText('Jerry Mil');

    expect(title).toBeDefined();
  });

  it('triggers avatar callback when clicked', () => {
    const { getByRole } = componentWrapper;
    const avatar = getByRole('img');

    fireEvent.click(avatar);

    expect(handleClickAvatar).toHaveBeenCalledTimes(1);
  });
});
