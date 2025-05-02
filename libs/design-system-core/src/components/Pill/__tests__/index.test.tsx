import React from 'react';
import { act, fireEvent } from '@testing-library/react';

import { XIcon } from 'lucide-react';
import Pill from '../';
import { customRender } from '../../../test-utils';

const label = 'Default text';
const mockChangeHandler = jest.fn();

describe('<Pill /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <Pill
          label={label}
          icon={<XIcon className="h-5 w-5" />}
          iconDirection="right"
          onPillClick={mockChangeHandler}
          type="action"
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
    const infoLabel = getByText(label);
    expect(infoLabel).toBeDefined();
  });

  it('correctly calls handler function when clicked', () => {
    const { getByRole } = componentWrapper;

    const dismissButton = getByRole('button', { name: 'dismiss' });

    fireEvent.click(dismissButton);

    expect(mockChangeHandler).toHaveBeenCalledTimes(1);
  });
});
