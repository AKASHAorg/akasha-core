import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import TextLine from '../';
import { customRender } from '../../../test-utils';

describe('<TextLine /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const title = 'Hello World';

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(<TextLine title={title} />, {});
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

  it('has correct title', () => {
    const { getByTitle } = componentWrapper;

    const element = getByTitle(title);

    expect(element).toBeDefined();
  });
});
