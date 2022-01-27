import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import Checkbox from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<Checkbox /> Component unchecked', () => {
  let componentWrapper = customRender(<></>, {});

  const LABEL = 'Hello this is label';

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(<Checkbox label={LABEL} onChange={() => null} checked={false} />),
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
    const label = getByText(LABEL);
    expect(label).toBeDefined();
  });

  it('has no checkmark', () => {
    const { container } = componentWrapper;
    const checkmark = container.querySelector('svg');
    expect(checkmark).toBeFalsy();
  });
});

describe('<Checkbox /> Component checked', () => {
  let componentWrapper = customRender(<></>, {});

  const LABEL = 'Hello this is label';

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(<Checkbox label={LABEL} onChange={() => null} checked={true} />),
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

  it('has checkmark', () => {
    const { container } = componentWrapper;
    const checkmark = container.querySelector('svg');
    expect(checkmark).toBeDefined();
  });
});
