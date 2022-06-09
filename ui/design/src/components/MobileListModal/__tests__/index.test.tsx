import React from 'react';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MobileListModal from '../';

import { customRender, wrapWithTheme } from '../../../test-utils';

const modalSlot = 'modal-slot';

const prepPortalMock = () => {
  const modalRoot = global.document.createElement('div');
  modalRoot.setAttribute('id', modalSlot);
  const body = global.document.querySelector('body');
  body.appendChild(modalRoot);
};

const teardownPortalMock = () => {
  const body = global.document.querySelector('body');
  body.removeChild(global.document.getElementById(modalSlot));
};

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
      prepPortalMock();
      componentWrapper = customRender(
        wrapWithTheme(
          <>
            <MobileListModal
              menuItems={menuItems}
              closeModal={handleCloseModal}
              modalSlotId={modalSlot}
              cancelLabel={'test'}
            />
          </>,
        ),
        {},
      );
    });
  });

  afterEach(() => {
    act(() => {
      teardownPortalMock();
      componentWrapper.unmount();
    });
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

  it('can call handlers on the list items', async () => {
    const { getByText } = componentWrapper;

    const repostButton = getByText('Repost');
    const repostWithCommentButton = getByText('Repost with comment');

    expect(handleRepost).toBeCalledTimes(0);
    expect(handleRepostWithComment).toBeCalledTimes(0);

    await userEvent.click(repostButton);
    await userEvent.click(repostWithCommentButton);

    expect(handleRepost).toBeCalledTimes(1);
    expect(handleRepostWithComment).toBeCalledTimes(1);
  });
});
