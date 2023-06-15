import * as React from 'react';
import { act } from '@testing-library/react';
import Meter from '../';
import { customRender } from '../../../test-utils';

describe('<Meter /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const content = (
    <>
      <p>content 1</p>
      <p>content 2</p>
    </>
  );

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <Meter size={400} thickness={5} value={60} type="bar">
          {content}
        </Meter>,
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

  it('has correct content', () => {
    const { getAllByText } = componentWrapper;

    const childNodes = getAllByText(/content/);

    expect(childNodes).toBeDefined();
    expect(childNodes).toHaveLength(2);
  });
});
