import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import { fireEvent, queries, render } from '@testing-library/react';

import { GridContainer } from '../';

describe('<AppAvatar /> Component', () => {
  let componentWrapper;

  beforeEach(() => {
    act(() => {
      componentWrapper = render(
        <GridContainer>
          <div data-testid="grid-child">1</div>
        </GridContainer>,
      );
    });
  });

  afterEach(() => {
    act(() => componentWrapper.unmount());
    cleanup();
  });

  it('renders correctly', () => {
    expect(componentWrapper.container).toBeDefined();
  });

  it('accepts children', () => {
    const { findByTestId } = componentWrapper;
    expect(findByTestId('grid-child')).toBeDefined();
  });
});
