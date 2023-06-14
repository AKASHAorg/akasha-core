import * as React from 'react';
import { act } from '@testing-library/react';
import { customRender } from '../../../test-utils';
import Stack from '../';

const label = 'Stack content';
const StackContent = (
  <>
    <div>{label}</div>
    <div>{label}</div>
    <div>{label}</div>
  </>
);

describe('<Stack /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(<Stack direction="column"> {StackContent}</Stack>, {});
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('render children correctly', () => {
    const { getAllByText } = componentWrapper;
    const childDiv = getAllByText(label);
    expect(childDiv).toBeDefined();
    expect(childDiv.length).toEqual(3);
  });
  it('has the correct flex direction css property', () => {
    const { container } = componentWrapper;
    const wrapper = container.querySelector('div');
    expect(getComputedStyle(wrapper)['flex-direction']).toBe('column');
  });
});
