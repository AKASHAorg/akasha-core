import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import NotificationsPopover from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';
import { notificationsData } from '../../../utils/dummy-data';

describe('<NotificationsPopover /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const targetNode = document.createElement('div');
  document.body.appendChild(targetNode);

  const handleClosePopover = jest.fn();
  const handleClickNotification = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <NotificationsPopover
            target={targetNode}
            dataSource={notificationsData}
            closePopover={handleClosePopover}
            onClickNotification={handleClickNotification}
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

  it('has correct and equal number of comments and upvotes', () => {
    const { getAllByText } = componentWrapper;
    const comment = getAllByText('Comment');
    const upvote = getAllByText('Upvote');

    expect(comment).toHaveLength(5);
    expect(upvote).toHaveLength(5);
  });

  it('has correct number of avatars', () => {
    const { getAllByRole } = componentWrapper;
    const avatars = getAllByRole('img');

    expect(avatars).toHaveLength(10);
  });
});
