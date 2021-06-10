import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import SubtitleTextIcon from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';
import userEvent from '@testing-library/user-event';

describe('<SubtitleTextIcon /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleClick = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <SubtitleTextIcon
            labelColor="#132540"
            subtitleColor="#132540"
            label="Icon label"
            subtitle="Icon subtitle"
            labelSize="small"
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

    const label = getByText('Icon label');
    const subtitle = getByText('Icon label');

    expect(label).toBeDefined();
    expect(subtitle).toBeDefined();
  });

  it('calls handler when clicked', () => {
    const { getByText } = componentWrapper;

    const clickable = getByText('Icon label');
    expect(handleClick).toBeCalledTimes(0);

    userEvent.click(clickable);
    expect(handleClick).toBeCalledTimes(1);
  });
});
