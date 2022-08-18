import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import BubbleCard from '..';

import { customRender, wrapWithTheme } from '../../../test-utils';
import { entryData } from '../../../utils/dummy-data';

describe('<BubbleCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <BubbleCard
            locale="en"
            senderName="Jerry Mil"
            youLabel="You"
            content={entryData.slateContent}
            isFromLoggedUser={false}
            isRead={true}
            chatTimestamp="2022-06-16T10:07:15.000Z"
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

    // will be defined, since the message is not sent by the logged user
    expect(title).toBeDefined();
  });
});
