import * as React from 'react';
// import { create } from 'react-test-renderer';
import { render } from '@testing-library/react';

import MiniInfoWidgetCard from '../';
import { wrapWithTheme } from '../../../test-utils';

describe('MiniInfoWidgetCard component', () => {
  it('renders correctly', () => {
    render(
      wrapWithTheme(
        <MiniInfoWidgetCard
          titleLabel={'Example title'}
          subtitleLabel={'Description of a call to action. Something to prompt the user to click'}
          learnMoreLabel={'Learn more'}
          callToActionLabel={'Do something'}
        />,
      ),
    );
  });
});
