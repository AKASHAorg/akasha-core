import * as React from 'react';
import { act, cleanup, fireEvent } from '@testing-library/react';

import DuplexButton from '../';
import { customRender } from '../../../test-utils';
import { matchMediaMock } from '../../../test-utils/mocks';

const label = 'DuplexButton';
const activeLabel = 'Active';
const activeHoverLabel = 'Active Hover';
const inactiveLabel = 'Inactive';

const mockClickHandler = jest.fn(() => console.log('clicked'));

window.matchMedia = jest.fn().mockImplementation(matchMediaMock);

describe('<DuplexButton /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <DuplexButton
          label={label}
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
    act(() => componentWrapper.unmount());
    cleanup();
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
