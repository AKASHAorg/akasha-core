import * as React from 'react';
// import { create } from 'react-test-renderer';
import { render } from '@testing-library/react';

import { EntryCardHidden } from '../entry-card-hidden';
import { wrapWithTheme } from '../../../test-utils';

describe('EntryCardHidden component', () => {
  it('renders correctly', () => {
    render(
      wrapWithTheme(
        <EntryCardHidden
          awaitingModerationLabel={'You have reported this post. It is awaiting moderation.'}
          ctaLabel={'See it anyway'}
        />,
      ),
    );
  });
});
