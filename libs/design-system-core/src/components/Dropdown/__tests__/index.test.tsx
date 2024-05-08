import React from 'react';
import { act, fireEvent } from '@testing-library/react';

import Dropdown, { DropdownMenuItemType } from '../';
import { ArchiveBoxIcon, BeakerIcon } from '@heroicons/react/24/outline';
import { customRender } from '../../../test-utils';

const menuItems: DropdownMenuItemType[] = [
  { id: '1', icon: <BeakerIcon />, title: 'Option 1' },
  { id: '2', icon: <ArchiveBoxIcon />, title: 'Option 2' },
  { id: '3', icon: <ArchiveBoxIcon />, title: 'Option 3' },
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
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('shows content when clicked', () => {
    const { getByRole, getByText } = componentWrapper;

    const button = getByRole('button', { name: 'dropdown' });

    fireEvent.click(button);

    const randomOption = getByText(menuItems[Math.floor(Math.random() * menuItems.length)].title);

    expect(randomOption).toBeDefined();
  });
});
