import React from 'react';
import { act, fireEvent, waitFor } from '@testing-library/react';
import { customRender } from '../../../test-utils';
import Tooltip from '../';

const tooltipContent = 'I am a tooltip';
const label = 'Hover over me to know more';

describe('<Tooltip /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <Tooltip content={tooltipContent} placement="top">
          <>{label}</>
        </Tooltip>,
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

  it('has correct label', () => {
    const { getByText } = componentWrapper;
    const infoLabel = getByText(label);
    expect(infoLabel).toBeDefined();
  });
  it('correctly display tooltip when hovered', async () => {
    const { getByText } = componentWrapper;
    const infoLabel = getByText(label);

    fireEvent.mouseOver(infoLabel);

    const tooltipText = getByText(tooltipContent);
    await waitFor(() => {
      expect(tooltipText).toBeDefined();
    });
  });
});
