import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import { customRender, wrapWithTheme } from '../../../test-utils';
import InfoCard from '../index';

describe('<InfoCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(<InfoCard icon="search" title="InfoCard Title" suggestion="Where title" />),
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

  it('renders the title', () => {
    const { getByText } = componentWrapper;

    const title = getByText('InfoCard Title');
    expect(title).toBeDefined();
  });

  it('renders the suggestion', () => {
    const { getByText } = componentWrapper;

    const suggestion = getByText('Where title');
    expect(suggestion).toBeDefined();
  });
});
