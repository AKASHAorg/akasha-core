import * as React from 'react';
import { act, cleanup, fireEvent } from '@testing-library/react';
import AutoComplete from '../';
import { customRender } from '../../../test-utils';

describe('<AutoComplete /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const changeHandler = jest.fn();
  const placeholderText = 'search here';

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <AutoComplete
          options={['AKASHA', 'AKIRA', 'Travel', 'Cooking', 'Ethereum', 'Finance']}
          placeholder={placeholderText}
          onChange={changeHandler}
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

  it('calls handler', () => {
    const { getByPlaceholderText } = componentWrapper;

    const input = getByPlaceholderText(placeholderText) as HTMLInputElement;

    expect(input.value).toBe('');
    expect(changeHandler).toBeCalledTimes(0);

    fireEvent.change(input, { target: { value: 'Akasha' } });

    expect(input.value).toBe('Akasha');
    expect(changeHandler).toBeCalledTimes(1);
  });
});
