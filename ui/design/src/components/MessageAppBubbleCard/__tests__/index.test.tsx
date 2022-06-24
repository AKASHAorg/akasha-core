import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import MessageAppBubbleCard from '../';
import ReadOnlyEditor from '../../ReadOnlyEditor';

import { customRender, wrapWithTheme } from '../../../test-utils';
import { entryData } from '../../../utils/dummy-data';

describe('<MessageAppBubbleCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleMentionClick = jest.fn();
  const handleTagClick = jest.fn();
  const handleLinkClick = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <MessageAppBubbleCard
            locale="en"
            sender="Jerry Mil"
            youLabel="You"
            content={
              <ReadOnlyEditor
                content={entryData.slateContent}
                handleMentionClick={handleMentionClick}
                handleTagClick={handleTagClick}
                handleLinkClick={handleLinkClick}
              />
            }
            isLoggedUser={false}
            status="sent"
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
