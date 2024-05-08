import * as React from 'react';
import { act } from '@testing-library/react';
import Text from '../';
import { customRender } from '../../../test-utils';

describe('<Text /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const text = 'Hello World';

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(<Text variant="h5">{text}</Text>, {});
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('has correct content', () => {
    const { getByText } = componentWrapper;

    const element = getByText(text);

    expect(element).toBeDefined();
  });
});
