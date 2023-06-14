import * as React from 'react';
import { act, cleanup, fireEvent } from '@testing-library/react';
import ScrollTopButton from '../';
import { customRender } from '../../../test-utils';

describe('<ScrollTopButton /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleClick = jest.fn(/** */);

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(<ScrollTopButton onClick={handleClick} />, {});
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

  it('calls handler when clicked', () => {
    const { getByTestId } = componentWrapper;

    const scrollTopDiv = getByTestId('scroll-to-top');

    expect(scrollTopDiv).toBeDefined();
    expect(handleClick).toBeCalledTimes(0);

    fireEvent.click(scrollTopDiv);

    expect(handleClick).toBeCalledTimes(1);
  });
});
