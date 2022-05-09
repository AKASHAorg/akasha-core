import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import EmbedBox from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';
import { entryData } from '../../../utils/dummy-data';

describe('<EmbedBox /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const targetNode = document.createElement('div');
  document.body.appendChild(targetNode);

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <EmbedBox
            embedEntryData={{
              ...entryData,
              slateContent: [],
            }}
          />,
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
