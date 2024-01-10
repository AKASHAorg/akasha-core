import React from 'react';
import Badge from '../';
import { act } from '@testing-library/react';
import { customRender } from '../../../test-utils';

describe('<Badge /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(<Badge>Badge</Badge>, {});
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });
});
