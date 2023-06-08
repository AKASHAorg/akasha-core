import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import Divider from '../';
import { customRender } from '../../../test-utils';

describe('<Divider /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(<Divider />, {});
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
