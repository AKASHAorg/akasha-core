import React from 'react';
import { act, cleanup, fireEvent } from '@testing-library/react';

import Pill from '../';
import { customRender } from '../../../test-utils';

const label = 'Default text';
const mockChangeHandler = jest.fn(() => {
  console.log('clicked dismiss');
});

describe('<Pill /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <Pill
          infoLabel={label}
          trailingIcon="XMarkIcon"
          handleDismiss={() => mockChangeHandler()}
        />,
        {},
      );
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

  it('has correct label', () => {
    const { getByText } = componentWrapper;
    const infoLabel = getByText(label);
    expect(infoLabel).toBeDefined();
  });
  it('correctly calls handler function when clicked', () => {
    const { getByTestId } = componentWrapper;
    const dismissButton = getByTestId('dismiss-button');
    fireEvent.click(dismissButton);
    expect(mockChangeHandler).toHaveBeenCalledTimes(1);
  });
});
