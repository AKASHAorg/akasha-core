import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import TutorialWidgetCard from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<TutorialWidgetCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});
  const handleSeeVideoTutorial = jest.fn();
  const handleDismiss = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <TutorialWidgetCard
            currentProgress={0}
            titleLabel="Pick your ethereum name"
            subtitleLabel="Take your address to the next level"
            infoLabel="Your human-friendly Ethereum name can be used also in wallets instead of your address"
            subtitleIcon="iconEns"
            seeVideoTutorialLabel="See video tutorial"
            callToActionLabel="Go to app"
            learnMoreLabel="Learn more"
            handleSeeVideoTutorial={handleSeeVideoTutorial}
            handleDismiss={handleDismiss}
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
    const title = getByText('Pick your ethereum name');
    expect(title).toBeDefined();
  });
});
