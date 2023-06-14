import * as React from 'react';
import { act } from '@testing-library/react';
import BasicPopover from '../';
import { customRender } from '../../../test-utils';

const item = 'Text line';

const content = (
  <div>
    <div>{item}</div>
    <div>{item}</div>
  </div>
);

const targetNode = document.createElement('div');
document.body.appendChild(targetNode);

describe('<BasicPopover /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleClosePopover = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <BasicPopover target={targetNode} closePopover={handleClosePopover}>
          {content}
        </BasicPopover>,
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

  it('renders correct content', () => {
    const { getAllByText } = componentWrapper;

    const content = getAllByText(item);

    expect(content).toBeDefined();
    expect(content).toHaveLength(2);
  });
});
