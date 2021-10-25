import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import AppInfoWidgetCard from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';
import { appInfo } from '../../../utils/dummy-data';

describe('<AppInfoWidgetCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <AppInfoWidgetCard
            appInfo={appInfo}
            versionLabel={'Version'}
            statusLabel={'Status'}
            lastUpdateLabel={'Last updated'}
            submittedLabel={'Submitted'}
            adminLabel={'Admin'}
            categoryLabel={'Category'}
            receiveUpdatesLabel={'Receive updates from'}
            subscribeLabel={'Subscribe'}
            unsubscribeLabel={'Unsubscribe'}
            reportLabel={'Flag as inappropriate'}
            handleSubscribe={() => null}
            handleReport={() => null}
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

  it('has subscribe button with correct label', () => {
    const { getByRole } = componentWrapper;
    const subscribeButton = getByRole('button', { name: 'Subscribe' });
    expect(subscribeButton).toBeDefined();
  });

  it('has iconLink with correct Label', () => {
    const { getByText } = componentWrapper;
    const reportLabel = getByText(/flag as inappropriate/i);
    expect(reportLabel).toBeDefined();
  });
});
