import * as React from 'react';
import { act } from '@testing-library/react';
import CircularPlaceholder from '../';
import { customRender } from '../../../test-utils';

describe('<CircularPlaceholder /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const title = 'Placeholder title';

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(<CircularPlaceholder title={title} />, {});
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('has correct title', () => {
    const { getByTitle } = componentWrapper;

    const found = getByTitle(title);

    expect(found).toBeDefined();
  });
});
