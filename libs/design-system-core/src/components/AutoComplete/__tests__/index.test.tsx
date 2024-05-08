import * as React from 'react';
import { act, fireEvent } from '@testing-library/react';
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

    fireEvent.change(input, { target: { value: 'AKASHA' } });

    expect(input.value).toBe('AKASHA');
    expect(changeHandler).toBeCalledTimes(1);
  });
});
