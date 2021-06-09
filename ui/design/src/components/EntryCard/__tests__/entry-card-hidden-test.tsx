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
            awaitingModerationLabel={'You have reported this content. It is awaiting moderation.'}
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
