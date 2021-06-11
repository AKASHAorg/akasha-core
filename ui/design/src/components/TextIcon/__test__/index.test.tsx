import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import TextIcon from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';
import userEvent from '@testing-library/user-event';

describe('<TextIcon /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleClick = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <TextIcon
            color="#132540"
            label="Home"
            spacing="10px"
            margin={{ margin: '10px' }}
            clickable={false}
            menuActive={false}
            menuIcon={false}
            accentColor={false}
            fadedText={false}
            disabled={false}
            fontSize="medium"
            fontWeight="normal"
            iconSize="md"
            iconType="home"
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

  it('has correct label and subtitle', () => {
    const { getByText } = componentWrapper;

    const label = getByText('Home');

    expect(label).toBeDefined();
  });

  it('calls handler when clicked', () => {
    const { getByText } = componentWrapper;

    const clickable = getByText('Home');
    expect(handleClick).toBeCalledTimes(0);

    userEvent.click(clickable);
    expect(handleClick).toBeCalledTimes(1);
  });
});
