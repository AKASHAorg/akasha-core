import * as React from 'react';
// import { create } from 'react-test-renderer';
import { render } from '@testing-library/react';

import AppInfoWidgetCard from '../';
import { wrapWithTheme } from '../../../test-utils';
import { appInfo } from '../../../utils/dummy-data';

describe('AppWidgetInfoCard component', () => {
  it('renders correctly', () => {
    render(
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
    );
  });
});
