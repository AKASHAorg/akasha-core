import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MiniInfoWidgetCard from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<MiniInfoWidgetCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleLearnMore = jest.fn();
  const handleCallToAction = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <MiniInfoWidgetCard
            titleLabel="Example title"
            subtitleLabel="Description of a call to action. Something to prompt the user to click"
            learnMoreLabel="Learn more"
            callToActionLabel="Do something"
            handleLearnMore={handleLearnMore}
            handleCallToAction={handleCallToAction}
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

  it('has correct title and subtitle', () => {
    const { getByText } = componentWrapper;
    const title = getByText('Example title');
    const mdText = getByText(/Description /);

    expect(title).toBeDefined();
    expect(mdText).toBeDefined();
  });

  it('has two buttons', () => {
    const { getAllByRole } = componentWrapper;
    const buttons = getAllByRole('button');

    expect(buttons).toHaveLength(2);
  });

  it('can call handlers attached to the buttons', () => {
    const { getByRole } = componentWrapper;

    const learnMoreButton = getByRole('button', { name: 'Learn more' });
    const doSomethingButton = getByRole('button', { name: 'Do something' });

    expect(learnMoreButton).toBeDefined();
    expect(doSomethingButton).toBeDefined();

    expect(handleLearnMore).toHaveBeenCalledTimes(0);
    expect(handleCallToAction).toHaveBeenCalledTimes(0);

    userEvent.click(learnMoreButton);
    userEvent.click(doSomethingButton);

    expect(handleLearnMore).toHaveBeenCalledTimes(1);
    expect(handleCallToAction).toHaveBeenCalledTimes(1);
  });
});
