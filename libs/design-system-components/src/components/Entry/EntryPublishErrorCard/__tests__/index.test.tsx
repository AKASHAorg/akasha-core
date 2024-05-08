import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import { customRender } from '@akashaorg/design-system-core/src/test-utils';

import EntryPyblishErrorCard from '../';

describe('<EntryPyblishErrorCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <EntryPyblishErrorCard isCard={true} message="Sorry, an error occured!" />,
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

  it('renders correct message', () => {
    const { getByText } = componentWrapper;
    const message = getByText(/Sorry, an error occured!/i);

    expect(message).toBeDefined();
  });
});
