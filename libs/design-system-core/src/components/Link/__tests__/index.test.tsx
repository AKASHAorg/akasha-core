import * as React from 'react';
import { act, fireEvent } from '@testing-library/react';

import Link from '..';
import { customRender } from '../../../test-utils';

describe('<Link /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const link = 'https://akasha.world';
  const dataTestId = 'link-component';

  const dummyClickFn = jest.fn(() => {
    /** */
  });

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(<Link to={link} dataTestId={dataTestId} />, {});
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('has correct link', () => {
    const { getByRole } = componentWrapper;

    const link = getByRole('link');

    expect(link).toHaveAttribute('href', link.getAttribute('href'));
  });

  it('handles click event', () => {
    const { getByRole } = componentWrapper;

    const link = getByRole('link');

    expect(dummyClickFn).toHaveBeenCalledTimes(0);

    /**
     * add event listener,
     * simulate click
     * assert
     */
    link.addEventListener('click', dummyClickFn);
    fireEvent.click(link);

    expect(dummyClickFn).toHaveBeenCalledTimes(1);
  });
});
