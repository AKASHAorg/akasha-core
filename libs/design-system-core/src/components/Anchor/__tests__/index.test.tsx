import * as React from 'react';
import { act, fireEvent } from '@testing-library/react';

import Anchor from '../';
import { customRender } from '../../../test-utils';

describe('<Anchor /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const link = 'https://akasha.world';
  const dataTestId = 'anchor-element';

  const dummyClickFn = jest.fn(() => {
    /** */
  });

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(<Anchor href={link} dataTestId={dataTestId} />, {});
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

    const anchor = getByRole('link');

    expect(anchor).toHaveAttribute('href', link);
  });

  it('handles click event', () => {
    const { getByRole } = componentWrapper;

    const anchor = getByRole('link');

    expect(dummyClickFn).toHaveBeenCalledTimes(0);

    /**
     * add event listener,
     * simulate click
     * assert
     */
    anchor.addEventListener('click', dummyClickFn);
    fireEvent.click(anchor);

    expect(dummyClickFn).toHaveBeenCalledTimes(1);
  });
});
