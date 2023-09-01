import * as React from 'react';
import { act, fireEvent } from '@testing-library/react';

import DuplexButton from '../';
import { customRender } from '../../../test-utils';

const label = 'DuplexButton';
const activeLabel = 'Active';
const activeHoverLabel = 'Active Hover';
const inactiveLabel = 'Inactive';

const mockClickHandler = jest.fn(() => console.log('clicked'));

describe('<DuplexButton /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <DuplexButton
          onClick={() => mockClickHandler()}
          active={true}
          activeLabel={activeLabel}
          activeHoverLabel={activeHoverLabel}
          inactiveLabel={inactiveLabel}
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
  it('has correct label when hovered', () => {
    const { getByText } = componentWrapper;

    let button: HTMLElement;
    button = getByText(activeLabel);

    expect(button).toBeDefined();

    fireEvent.mouseOver(button);

    button = getByText(activeHoverLabel);

    expect(button).toBeDefined();
  });
});
