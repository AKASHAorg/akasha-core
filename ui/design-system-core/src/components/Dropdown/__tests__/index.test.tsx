import React from 'react';
import { act, cleanup, fireEvent } from '@testing-library/react';
import Dropdown, { DropdownMenuItemType } from '../';
import { customRender } from '../../../test-utils';

const menuItems: DropdownMenuItemType[] = [
  { id: '1', iconName: 'BeakerIcon', title: 'Option 1' },
  { id: '2', iconName: 'ArchiveBoxIcon', title: 'Option 2' },
  { id: '3', iconName: 'ArchiveBoxIcon', title: 'Option 3' },
];

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
    act(() => componentWrapper.unmount());
    cleanup();
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

    const defaultSelected = getByText(selected.title);

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
    act(() => componentWrapper.unmount());
    cleanup();
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('shows content when clicked', () => {
    const { getByTestId, getByText } = componentWrapper;

    const button = getByTestId('drop-button');

    fireEvent.click(button);

    const randomOption = getByText(menuItems[Math.floor(Math.random() * menuItems.length)].title);

    expect(randomOption).toBeDefined();
  });
});
