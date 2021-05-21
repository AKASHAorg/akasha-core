import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import VoteIconButton from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<VoteIconButton /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleClick = jest.fn();
  const voteCount = 147;

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <VoteIconButton voteType="upvote" voteCount={voteCount} onClick={handleClick} />,
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

  it('has correct vote count', () => {
    const { getByText } = componentWrapper;
    const icon = getByText(voteCount);
    expect(icon).toBeDefined();
  });

  it('responds to click', () => {
    const { getByText } = componentWrapper;
    // should never been clicked yet
    expect(handleClick).toHaveBeenCalledTimes(0);

    const icon = getByText(voteCount);
    userEvent.click(icon);

    // should be clicked by now
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
