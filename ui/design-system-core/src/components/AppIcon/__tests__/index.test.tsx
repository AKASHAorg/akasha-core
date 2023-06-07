import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import AppIcon from '../';
import { customRender } from '../../../test-utils';

describe('<AppIcon /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(<AppIcon placeholderIconType="discord" />, {});
    });
  });

  afterEach(() => {
    act(() => componentWrapper.unmount());
    cleanup();
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });
});
