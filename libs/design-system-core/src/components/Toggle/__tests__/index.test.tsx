import React from 'react';
import { act, fireEvent } from '@testing-library/react';
import { customRender } from '../../../test-utils';
import Toggle from '../';

const label = 'Default label';
let enabled = false;
const mockChangeHandler = jest.fn(() => (enabled = !enabled));

describe('<Toggle /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      enabled = false;
      componentWrapper = customRender(
        <Toggle label={label} checked={enabled} onChange={mockChangeHandler} />,
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
  it('correctly call handler function when clicked', () => {
    const { container } = componentWrapper;
    const toggleButton = container.querySelector('input');
    fireEvent.click(toggleButton);
    expect(mockChangeHandler).toHaveBeenCalledTimes(1);
  });
  it('correctly toggle when clicked', () => {
    const { container, rerender } = componentWrapper;
    const toggleButton = container.querySelector('input');
    const isChecked = toggleButton.checked;
    fireEvent.click(toggleButton);
    //rerender the component with the updated checked prop
    rerender(<Toggle label={label} checked={enabled} onChange={mockChangeHandler} />);
    expect(toggleButton.checked).toEqual(!isChecked);
  });
});
