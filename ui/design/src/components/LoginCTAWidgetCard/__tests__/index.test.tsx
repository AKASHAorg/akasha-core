import * as React from 'react';
// import { create } from 'react-test-renderer';
import { render } from '@testing-library/react';

import LoginCTAWidgetCard from '../';
import { wrapWithTheme } from '../../../test-utils';

describe('LoginCTAWidgetCard component', () => {
  it('renders correctly', () => {
    render(
      wrapWithTheme(
        <LoginCTAWidgetCard
          title={'🚀 Welcome to Ethereum World!'}
          subtitle={'We are in private alpha at this time. '}
          beforeLinkLabel={"If you'd like to participate,"}
          afterLinkLabel={"and we'll add you to our waitlist!"}
          writeToUsLabel={'write to us'}
          writeToUsUrl={'mailto:alpha@ethereum.world'}
        />,
      ),
    );
  });
});
