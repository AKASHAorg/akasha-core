import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import ModerationIntroCard from '..';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<ModerationIntroCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleCodeOfConductClick = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <ModerationIntroCard
            titleLabel="Moderating"
            subtitleLabel="Find all the moderated posts, replies and accounts"
            isIntro={true}
            introLabel="Welcome to the Moderation App"
            descriptionLine1Label="Here you will find the moderated posts, replies, and accounts of Ethereum World. We do not reveal any personal information of the author or submitter(s) to protect their privacy."
            descriptionLine2IntroLabel="Visit our"
            codeOfConductLabel="Code of Conduct"
            descriptionLine2Label="to learn more about our moderation criteria"
            onCodeOfConductClick={handleCodeOfConductClick}
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

  it('renders correct title and detail', () => {
    const { getByText } = componentWrapper;
    const title = getByText(/Moderating/);
    const subtitle = getByText(/Find all the moderated posts, replies and accounts/);

    expect(title).toBeDefined();
    expect(subtitle).toBeDefined();
  });

  it('renders an image with correct src', () => {
    const { getByRole } = componentWrapper;
    const image = getByRole('img');

    expect(image).toBeDefined();
    expect(image).toHaveAttribute('src', '/images/moderation.webp');
  });
});
