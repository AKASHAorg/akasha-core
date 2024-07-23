import React from 'react';
import { act, fireEvent } from '@testing-library/react';

import Snackbar from '../';
import { customRender } from '../../../test-utils';
import { NotificationTypes } from '@akashaorg/typings/lib/ui';

const title = 'Default title';
const description = 'Default description';

const mockChangeHandler = jest.fn();

describe('<Snackbar /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <Snackbar
          type={NotificationTypes.Info}
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
    expect(infoTitle).toBeInTheDocument();
  });

  it('correctly calls handler function when clicked', () => {
    const { getByRole } = componentWrapper;
    const dismissButton = getByRole('button', { name: 'dismiss' });
    fireEvent.click(dismissButton);
    expect(mockChangeHandler).toHaveBeenCalledTimes(1);
  });
});
