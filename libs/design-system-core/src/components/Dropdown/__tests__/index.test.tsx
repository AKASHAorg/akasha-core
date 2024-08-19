import React from 'react';
import { act, fireEvent } from '@testing-library/react';

import Dropdown from '../';
import { customRender } from '../../../test-utils';

const menuItems: string[] = ['Option 1', 'Option 2', 'Option 3'];

const label = 'Select one';
const placeholderLabel = 'Select an option';
const selected = menuItems[0];
const setSelected = jest.fn();

describe('<Dropdown /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <Dropdown
          name="dropdown"
          menuItems={menuItems}
          label={label}
          selected={selected}
          setSelected={setSelected}
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

  it('shows label when specified', () => {
    const { getByText } = componentWrapper;

    const value = getByText(label);

    expect(value).toBeDefined();
  });

  it('shows selected menu option by default', () => {
    const { getByText } = componentWrapper;

    const defaultSelected = getByText(selected);

    expect(defaultSelected).toBeDefined();
  });
});

describe('<Dropdown /> Component with placeholder', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <Dropdown
          name="dropdown"
          menuItems={menuItems}
          setSelected={setSelected}
          placeholderLabel={placeholderLabel}
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

  it('shows content when clicked', () => {
    const { getByRole, getByText } = componentWrapper;

    const button = getByRole('button', { name: 'dropdown' });

    fireEvent.click(button);

    const randomOption = getByText(menuItems[Math.floor(Math.random() * menuItems.length)]);

    expect(randomOption).toBeDefined();
  });
});
