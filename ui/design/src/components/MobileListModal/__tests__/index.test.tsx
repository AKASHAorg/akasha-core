import React from 'react';
import { Box } from 'grommet';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MobileListModal from '../';
import Icon from '../../Icon';
import { customRender, wrapWithTheme } from '../../../test-utils';

const BaseComponent = (args: { handleRepost: () => void; handleRepostWithComment: () => void }) => {
  const iconRef = React.useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  const menuItems = [
    {
      label: 'Repost',
      icon: 'transfer',
      handler: (e: React.MouseEvent) => {
        e.stopPropagation();
        args.handleRepost();
      },
    },
    {
      label: 'Repost with comment',
      icon: 'edit',
      handler: (e: React.MouseEvent) => {
        e.stopPropagation();
        args.handleRepostWithComment();
      },
    },
  ];

  return (
    <Box width="medium" pad={{ top: 'large' }}>
      <div ref={iconRef}>
        <Icon type="eye" testId="eye-icon" onClick={() => setModalOpen(true)} />
      </div>
      const menuItems = [
      {iconRef?.current && modalOpen && (
        <MobileListModal menuItems={menuItems} closeModal={() => setModalOpen(false)} />
      )}
    </Box>
  );
};

describe('<MobileListModal /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleRepost = jest.fn();
  const handleRepostWithComment = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <BaseComponent
            handleRepost={handleRepost}
            handleRepostWithComment={handleRepostWithComment}
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

  it('renders modal when clicked', () => {
    const { getByText, getByTestId } = componentWrapper;
    const icon = getByTestId('eye-icon');
    expect(icon).toBeDefined();

    // perform click action to reveal modal
    userEvent.click(icon);

    const repostButton = getByText('Repost');

    expect(repostButton).toBeDefined();
  });

  it('can call handlers on the list items', () => {
    const { getByText, getByTestId } = componentWrapper;
    const icon = getByTestId('eye-icon');
    expect(icon).toBeDefined();

    // perform click action to reveal modal
    userEvent.click(icon);

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
