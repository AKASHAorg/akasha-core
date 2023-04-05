import React from 'react';
import { act, cleanup } from '@testing-library/react';
import { customRender } from '../../../test-utils';
import Icon from '../';

describe('<Snackbar /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(<Icon type="akasha" testId="akasha-icon" />, {});
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

  it('receives the test-id passed in the props', () => {
    const { getByTestId } = componentWrapper;
    const icon = getByTestId('akasha-icon');
    expect(icon).toBeDefined();
  });
});
