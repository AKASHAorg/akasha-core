import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import Card from '../';
import { customRender } from '../../../test-utils';

describe('<Card /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const content = 'Card Content';

  const children = (
    <>
      <p>{content}</p>
      <p>{content}</p>
      <p>{content}</p>
    </>
  );

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(<Card>{children}</Card>, {});
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

  it('renders correct card content', () => {
    const { getAllByText } = componentWrapper;

    const contents = getAllByText(content);

    expect(contents).toBeDefined();
    expect(contents.length).toEqual(3);
  });
});
