import * as React from 'react';
import { act, fireEvent } from '@testing-library/react';

import Checkbox from '../';
import { customRender } from '../../../test-utils';

const LABEL = 'Default label';
let checkedState = false;
const mockClickHandler = jest.fn(() => (checkedState = !checkedState));

describe('<Checkbox /> Component unchecked', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <Checkbox
          label={LABEL}
          handleChange={() => mockClickHandler()}
          isSelected={checkedState}
          id="test"
          value={LABEL}
          name="default-checkbox"
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
    const label = getByText(LABEL);
    expect(label).toBeDefined();
  });
});

describe('<Checkbox /> Component checked', () => {
  let componentWrapper = customRender(<></>, {});
  let checkedState = true;
  const mockClickHandler = jest.fn(() => (checkedState = !checkedState));

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <Checkbox
          label={LABEL}
          handleChange={() => mockClickHandler()}
          isSelected={checkedState}
          id="test"
          value={LABEL}
          name="default-checkbox"
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

  it('has checkmark when checked', () => {
    const { container } = componentWrapper;
    const checkmark = container.querySelector('input');
    expect(checkmark.checked).toBeTruthy();
  });
  it('correctly calls handler function when clicked', () => {
    const { container } = componentWrapper;
    const checkbox = container.querySelector('#test');
    fireEvent.click(checkbox);
    expect(mockClickHandler).toHaveBeenCalledTimes(1);
  });
  it('correctly uncheck the checkbox when clicked', () => {
    const { container } = componentWrapper;
    const checkbox = container.querySelector('#test') as HTMLInputElement;
    fireEvent.click(checkbox);
    expect(checkbox.checked).not.toBeTruthy();
  });
});
