import * as React from 'react';
import { act, cleanup, fireEvent } from '@testing-library/react';

import { customRender } from '@akashaorg/design-system-core/src/test-utils';

import MessageContactCard from '..';

describe('<MessageContactCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleClickCard = jest.fn();
  const handleClickAvatar = jest.fn();
  const handleConvoPin = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <MessageContactCard
          locale="en"
          senderName="Jerry Mil"
          content="Hello Jerry I hope you're good and having a great day?"
          isRead={true}
          isPinned={false}
          pinConvoLabel="Pin"
          unpinConvoLabel="Unpin"
          senderAvatar={{
            default: { src: 'https://placebeard.it/360x360', width: 360, height: 360 },
          }}
          senderDid="did:0x003410490050000320006570034567114572000"
          onClickCard={handleClickCard}
          onClickAvatar={handleClickAvatar}
          onConvoPin={handleConvoPin}
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
