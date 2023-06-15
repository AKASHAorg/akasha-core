import * as React from 'react';
import { act } from '@testing-library/react';
import EditorMeter from '../';
import { customRender } from '../../../test-utils';

describe('<EditorMeter /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const max = 120;
  const value = 119;

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(<EditorMeter max={max} value={value} />, {});
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('has correct display counter', () => {
    const { getByText } = componentWrapper;

    const counter = getByText(max - value);

    expect(counter).toBeDefined();
    expect(counter.textContent).toEqual((max - value).toString());
  });
});
