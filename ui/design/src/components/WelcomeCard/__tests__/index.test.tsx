import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import WelcomeCard from '..';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<WelcomeCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handlePrimaryButtonClick = jest.fn();
  const handleSecondaryButtonClick = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <WelcomeCard
            titleLabel="Welcome to the alpha!"
            subtitleLabel="Congratulations, you are the newest member of Ethereum World!"
            paragraphOneLabel="You can now browse the feed, subscribe to topics, write your own posts, and reply to other Ethereans."
            paragraphTwoIntroLabel="While you don’t have to do it now,"
            paragraphTwoBoldLabel="we do recommend you take the time to customize your profile"
            paragraphTwoNextLabel="You can change your display name and avatar, add a cover image and description, as well as claim your own AKASHA ENS name."
            paragraphThreeLabel="We are very happy you’ve joined us!"
            primaryButtonLabel="Browse Ethereum World"
            secondaryButtonLabel="Customize My Profile"
            handlePrimaryButtonClick={handlePrimaryButtonClick}
            handleSecondaryButtonClick={handleSecondaryButtonClick}
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

  it('has correct title', () => {
    const { getByText } = componentWrapper;

    const titleLabel = getByText('Welcome to the alpha!');

    expect(titleLabel).toBeDefined();
  });

  it('calls button handlers when clicked', () => {
    const { getByText } = componentWrapper;

    const primaryButtonLabel = getByText('Browse Ethereum World');
    const secondaryButtonLabel = getByText('Customize My Profile');

    expect(handlePrimaryButtonClick).toBeCalledTimes(0);
    expect(handleSecondaryButtonClick).toBeCalledTimes(0);

    userEvent.click(primaryButtonLabel);
    userEvent.click(secondaryButtonLabel);

    expect(handlePrimaryButtonClick).toBeCalledTimes(1);
    expect(handleSecondaryButtonClick).toBeCalledTimes(1);
  });
});
