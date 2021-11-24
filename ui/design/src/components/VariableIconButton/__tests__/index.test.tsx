import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import VariableIconButton from '..';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<VariableIconButton /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleClick = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <VariableIconButton
            titleLabel="Select Address in Wallet"
            errorLabel="some error text"
            isLoading={false}
            isError={false}
            onClick={handleClick}
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

  it('has correct title', () => {
    const { getByText } = componentWrapper;

    const titleLabel = getByText('Select Address in Wallet');

    expect(titleLabel).toBeDefined();
  });

  it('calls handler when clicked', () => {
    const { getByText } = componentWrapper;

    const titleLabel = getByText('Select Address in Wallet');
    expect(handleClick).toBeCalledTimes(0);

    userEvent.click(titleLabel);

    expect(handleClick).toBeCalledTimes(1);
  });
});
