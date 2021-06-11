import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TextInputField from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<TextInputField /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleChange = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <TextInputField
            id="text-input"
            label="text input field"
            name="text-input"
            placeholder="Enter a value"
            onChange={handleChange}
          />,
        ),
        {},
      );
    });
  });

  afterEach(() => {
    act(() => componentWrapper.unmount());
    cleanup();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('has a placeholder', () => {
    const { getByPlaceholderText } = componentWrapper;

    const placeholder = getByPlaceholderText('Enter a value');

    expect(placeholder).toBeDefined();
  });

  it('calls handler when input is changed', () => {
    const { getByRole } = componentWrapper;

    const textInput = getByRole('textbox');

    userEvent.type(textInput, 'Hello World');
    expect(handleChange).toBeCalled();
  });
});
