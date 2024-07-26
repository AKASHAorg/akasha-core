import * as React from 'react';
import { act, fireEvent, screen } from '@testing-library/react';
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
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('calls handler when clicked', () => {
    const scrollTop = screen.getByRole('button', { name: 'scroll-to-top' });

    expect(scrollTop).toBeInTheDocument();
    expect(handleClick).toHaveBeenCalledTimes(0);

    fireEvent.click(scrollTop);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
