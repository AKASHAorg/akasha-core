import * as React from 'react';

import { renderWithAllProviders, act, cleanup } from '@akashaorg/af-testing';

import { Moderators } from '../../pages';
import { generateModerators } from '../../utils';

describe('<Moderators /> component', () => {
  const Base = <Moderators isFetchingModerators={false} moderators={generateModerators()} />;

  let componentWrapper = renderWithAllProviders(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = renderWithAllProviders(Base, {});
    });
  });

  afterEach(() => {
    act(() => componentWrapper.unmount());
    cleanup();
  });

  it('should render component', async () => {
    expect(componentWrapper.baseElement).toBeInTheDocument();
  });
});
