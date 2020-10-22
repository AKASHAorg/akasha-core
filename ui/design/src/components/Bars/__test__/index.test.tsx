import '@testing-library/jest-dom/extend-expect';
import { cleanup } from '@testing-library/react';
import * as React from 'react';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import { wrapWithTheme } from '../../../test-utils';
import { Sidebar } from '../sidebar/sidebar';
import { Topbar } from '../topbar/topbar';

describe('<Sidebar /> component', () => {
  let componentWrapper: ReactTestRenderer = create(<></>);
  beforeEach(() => {
    act(() => {
      componentWrapper = create(
        wrapWithTheme(
          <Sidebar
            bodyMenuItems={[]}
            footerMenuItems={[]}
            allMenuItems={[]}
            onClickMenuItem={jest.fn()}
          />,
        ),
      );
    });
  });

  afterEach(() => {
    act(() => {
      componentWrapper.unmount();
    });
    cleanup();
  });

  it('should mount', () => {
    const root = componentWrapper.root;
    const sidebarComp = root.findByType(Sidebar);
    expect(sidebarComp).toBeDefined();
  });
});

describe('<Topbar /> Component', () => {
  let componentWrapper: ReactTestRenderer = create(<></>);
  beforeEach(() => {
    act(() => {
      componentWrapper = create(
        wrapWithTheme(
          <Topbar
            onNavigation={jest.fn()}
            onSearch={jest.fn()}
            avatarImage={'https://placebeard.it/640/480'}
            ethAddress={'0x0132312'}
            brandLabel={'test'}
            searchAreaItem={undefined}
            quickAccessItems={[]}
          />,
        ),
      );
    });
  });
  afterEach(() => {
    act(() => {
      componentWrapper.unmount();
    });
    cleanup();
  });

  it('should mount', () => {
    const root = componentWrapper.root;
    const topbarComp = root.findByType(Topbar);
    expect(topbarComp).toBeDefined();
  });
});
