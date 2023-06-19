import * as React from 'react';
import { act } from '@testing-library/react';
import Spinner from '../';
import { customRender } from '../../../test-utils';

describe('<Spinner /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(<Spinner />, {});
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });
});
