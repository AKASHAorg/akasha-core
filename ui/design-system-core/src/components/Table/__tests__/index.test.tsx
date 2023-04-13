import React from 'react';
import { act, cleanup } from '@testing-library/react';
import { customRender } from '../../../test-utils';
import Table from '../';

const theadValues = ['Header 1', 'Header 2'];
const rows = [
  ['Content Row 1', 'Content Row 1'],
  ['Content Row 2', 'Content Row 2'],
];

describe('<Table /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(<Table theadValues={theadValues} rows={rows} />, {});
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

  it('displays the table head correctly', () => {
    const { container } = componentWrapper;
    const tableHeader = container.querySelectorAll('th');
    expect(tableHeader.length).toBe(2);
  });

  it('displays the table cells correctly', () => {
    const { container } = componentWrapper;
    const tableRows = container.querySelectorAll('td');
    expect(tableRows.length).toBe(4);
  });
});
