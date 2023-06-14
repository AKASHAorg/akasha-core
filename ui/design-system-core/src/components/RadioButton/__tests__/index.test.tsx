import React from 'react';
import { act, fireEvent } from '@testing-library/react';

import RadioButton from '../';
import { customRender } from '../../../test-utils';

const value = 'Default value';
let selectedButton = false;
const mockChangeHandler = jest.fn(() => (selectedButton = !selectedButton));

describe('<RadioButton /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <RadioButton
          id="test"
          label={value}
          value={value}
          isSelected={selectedButton}
          handleChange={() => mockChangeHandler()}
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
    const label = getByText(value);
    expect(label).toBeDefined();
  });
  it('correctly show unchecked state', () => {
    const { container } = componentWrapper;
    const checkbox = container.querySelector('#test') as HTMLInputElement;
    expect(checkbox.checked).not.toBeTruthy();
  });
  it('correctly calls handler function when clicked', () => {
    const { container } = componentWrapper;
    const checkbox = container.querySelector('#test');
    fireEvent.click(checkbox);
    expect(mockChangeHandler).toHaveBeenCalledTimes(1);
  });

  it('correctly check the radio button when clicked', async () => {
    const { container } = componentWrapper;
    const checkbox = container.querySelector('#test') as HTMLInputElement;
    await fireEvent.click(checkbox);
    expect(checkbox.checked).toBeTruthy();
  });
});
