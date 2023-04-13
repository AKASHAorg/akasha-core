import React from 'react';
import { act, cleanup, fireEvent } from '@testing-library/react';

import Snackbar from '../';
import { customRender } from '../../../test-utils';

const title = 'Default title';
const description = 'Default description';

const mockChangeHandler = jest.fn(() => {
  console.log('clicked dismiss');
});

describe('<Snackbar /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <Snackbar
          type="alert"
          title={title}
          description={description}
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
    const infoTitle = getByText(title);
    expect(infoTitle).toBeDefined();
  });
  it('correctly calls handler function when clicked', () => {
    const { getByTestId } = componentWrapper;
    const dismissButton = getByTestId('dismiss-button');
    fireEvent.click(dismissButton);
    expect(mockChangeHandler).toHaveBeenCalledTimes(1);
  });
});
