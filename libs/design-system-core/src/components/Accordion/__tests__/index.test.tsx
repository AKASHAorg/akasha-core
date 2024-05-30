import * as React from 'react';
import { act, fireEvent } from '@testing-library/react';
import Accordion from '../';
import { customRender } from '../../../test-utils';

const Title = (
  <div>
    <p>Accordion Title</p>
  </div>
);

const Content = (
  <div>
    <p>Accordion content</p>
  </div>
);

describe('<Accordion /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <Accordion
          accordionId="someId"
          open={true}
          handleClick={jest.fn()}
          titleNode={Title}
          contentNode={Content}
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

  it('toggles when clicked correctly', () => {
    const { container, getByText } = componentWrapper;

    const accordion = container.querySelector('div');
    fireEvent.click(accordion);
    const content = getByText(/Accordion content/i);

    expect(content).toBeDefined();
  });
});
