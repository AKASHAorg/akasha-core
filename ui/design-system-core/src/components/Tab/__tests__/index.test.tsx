import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import { customRender } from '../../../test-utils';
import Tab from '../';

const TabLabels = ['Tab 1', 'Tab 2', 'Tab 3'];
const TabContent = (
  <>
    <div>Content 1</div>
    <div>Content 2</div>
    <div>Content 3</div>
  </>
);

const TabComponent = ({ labels }) => {
  const [value, setValue] = React.useState(0);
  return (
    <Tab value={value} onChange={setValue} labels={labels}>
      {TabContent}
    </Tab>
  );
};

describe('<Tab /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(<TabComponent labels={TabLabels} />, {});
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

  it('render children correctly', () => {
    const { getAllByText } = componentWrapper;
    const firstTab = getAllByText(/Tab/i);
    expect(firstTab).toBeDefined();
  });

  it('render all tabs correctly', () => {
    const { getAllByText } = componentWrapper;
    const firstTab = getAllByText(/Tab/i);
    expect(firstTab.length).toEqual(3);
  });

  it('has the correct flex direction css property', () => {
    const { container } = componentWrapper;
    const wrapper = container.querySelector('div');
    expect(getComputedStyle(wrapper)['flex-direction']).toBe('column');
  });
});
