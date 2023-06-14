import * as React from 'react';
import { act } from '@testing-library/react';
import Box from '../';
import { customRender } from '../../../test-utils';

const content = <p>Hello world</p>;

describe('<Box /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(<Box>{content}</Box>, {});
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });
});
