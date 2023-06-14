import React from 'react';
import { act, fireEvent } from '@testing-library/react';

import Snackbar from '../';
import { customRender } from '../../../test-utils';

const title = 'Default title';
const description = 'Default description';

const mockChangeHandler = jest.fn();

describe('<Snackbar /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <Snackbar
          type="alert"
          title={title}
          description={description}
          handleDismiss={mockChangeHandler}
        />,
        {},
      );
    });
  });

  afterEach(() => {
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
