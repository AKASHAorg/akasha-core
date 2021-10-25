import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import { EntryCardHidden } from '../entry-card-hidden';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<EntryCardHidden /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <EntryCardHidden
            headerTextLabel={'You reported this post for the following reason'}
            footerTextLabel={'It is awaiting moderation.'}
            reason={'Spam and malicious links'}
            ctaLabel={'See it anyway'}
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

  it('has correct labels', () => {
    const { getByText } = componentWrapper;
    const pendingLabel = getByText(/You have reported/i);
    const ctaLabel = getByText(/See it/i);

    expect(pendingLabel).toBeDefined();
    expect(ctaLabel).toBeDefined();
  });
});
