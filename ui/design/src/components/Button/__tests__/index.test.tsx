import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import Button from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<Button /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(<Button label="Default button" onClick={() => null} />),
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

  it('has correct label', () => {
    const { getByText } = componentWrapper;
    const label = getByText('Default button');
    expect(label).toBeDefined();
  });
});

describe('Primary Button component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(<Button label="Primary button" primary={true} onClick={() => null} />),
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

  it('has correct label', () => {
    const { getByText } = componentWrapper;
    const label = getByText('Primary button');
    expect(label).toBeDefined();
  });
});
