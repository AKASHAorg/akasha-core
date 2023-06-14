import * as React from 'react';
import { act } from '@testing-library/react';
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
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });
});
