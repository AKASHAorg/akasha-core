import React from 'react';
import { act } from '@testing-library/react';
import { customRender } from '../../../test-utils';
import { Akasha } from '../akasha-icons';

describe('<Icon /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(<Akasha />, {});
    });
  });

  afterEach(() => {
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
