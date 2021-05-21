import React from 'react';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MobileListModal from '../';

import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<MobileListModal /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleRepost = jest.fn();
  const handleRepostWithComment = jest.fn();
  const handleCloseModal = jest.fn();

  const menuItems = [
    {
      label: 'Repost',
      icon: 'transfer',
      handler: handleRepost,
    },
    {
      label: 'Repost with comment',
      icon: 'edit',
      handler: handleRepostWithComment,
    },
  ];

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(<MobileListModal menuItems={menuItems} closeModal={handleCloseModal} />),
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

  it('has correct list items', () => {
    const { getByText } = componentWrapper;

    const repostButton = getByText('Repost');
    const repostWithCommentButton = getByText('Repost with comment');

    expect(repostButton).toBeDefined();
    expect(repostWithCommentButton).toBeDefined();
  });

  it('can call handlers on the list items', () => {
    const { getByText } = componentWrapper;

    const repostButton = getByText('Repost');
    const repostWithCommentButton = getByText('Repost with comment');

    expect(handleRepost).toBeCalledTimes(0);
    expect(handleRepostWithComment).toBeCalledTimes(0);

    userEvent.click(repostButton);
    userEvent.click(repostWithCommentButton);

    expect(handleRepost).toBeCalledTimes(1);
    expect(handleRepostWithComment).toBeCalledTimes(1);
  });
});
