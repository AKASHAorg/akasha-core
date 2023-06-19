import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import { customRender } from '@akashaorg/design-system-core/src/test-utils';
import InfoCard from '../';

describe('<InfoCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <InfoCard
          suggestion="Where title"
          explanation="InfoCard explanation"
          keyword="test"
          preposition_in="in"
        />,
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

  it('renders the explanation', () => {
    const { getByText } = componentWrapper;

    const explanation = getByText(/InfoCard explanation/);
    expect(explanation).toBeDefined();
  });

  it('renders the suggestion', () => {
    const { getByText } = componentWrapper;

    const suggestion = getByText(/Where title/);
    expect(suggestion).toBeDefined();
  });
});
