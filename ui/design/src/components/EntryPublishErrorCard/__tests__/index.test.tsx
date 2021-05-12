import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import EntryPyblishErrorCard from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<EntryPyblishErrorCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(<EntryPyblishErrorCard isCard={true} message="Sorry, an error occured!" />),
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
