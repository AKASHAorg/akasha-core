import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import LinkInput from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<LinkInput /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleLinkInputChange = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <LinkInput inputValue={'some input value'} onChange={handleLinkInputChange} />,
        ),
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
});
