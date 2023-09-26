import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import { customRender } from '@akashaorg/design-system-core/lib/test-utils';

import BubbleCard from '..';

import { editorDefaultValue } from '../../Editor/initialValue';

describe('<BubbleCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <BubbleCard
          locale="en"
          senderName="Jerry Mil"
          youLabel="You"
          content={editorDefaultValue}
          isFromLoggedUser={false}
          chatTimestamp="2022-06-16T10:07:15.000Z"
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

    // will be defined, since the message is not sent by the logged user
    expect(title).toBeDefined();
  });
});
