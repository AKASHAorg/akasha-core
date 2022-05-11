import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { act, cleanup } from '@testing-library/react';

import ImageOverlay from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<ImageOverlay /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleCloseModal = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <ImageOverlay
            src={{ url: 'url', fallbackUrl: 'fallbackUrl' }}
            closeModal={handleCloseModal}
          />,
        ),
        {},
      );
    });
  });

  afterEach(() => {
    act(() => componentWrapper.unmount());
    cleanup();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('closes overlay when close icon is clicked', () => {
    const { getByTestId } = componentWrapper;

    const closeIcon = getByTestId('close-icon');

    expect(closeIcon).toBeDefined();
    expect(handleCloseModal).toBeCalledTimes(0);

    userEvent.click(closeIcon);

    expect(handleCloseModal).toBeCalledTimes(1);
  });
});
