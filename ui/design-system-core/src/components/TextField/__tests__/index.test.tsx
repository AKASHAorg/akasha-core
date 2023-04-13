import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import { customRender } from '../../../test-utils';
import TextField from '../';

const label = 'Text label';
const placeholder = 'Enter some text';

describe('<TextField /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(<TextField label={label} />, {});
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
  it('render the label correctly', () => {
    const { getByText } = componentWrapper;
    const textLabel = getByText(label);
    expect(textLabel).toBeDefined();
  });
  it('can be focused', () => {
    const { container } = componentWrapper;
    const input = container.querySelector('input');
    input.focus();
    expect(input).toHaveFocus();
  });
});

describe('<Disabled TextField /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <TextField disabled={true} label={label} placeholder={placeholder} />,
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

  it('doesn´t allow users to enter text', () => {
    const { container } = componentWrapper;
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('disabled');
  });
});
