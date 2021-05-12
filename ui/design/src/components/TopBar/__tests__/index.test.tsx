import { cleanup } from '@testing-library/react';
import * as React from 'react';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import { wrapWithTheme } from '../../../test-utils';
import Topbar from '../';

describe('<Topbar /> Component', () => {
  let componentWrapper: ReactTestRenderer = create(<></>);
  beforeEach(() => {
    act(() => {
      componentWrapper = create(
        wrapWithTheme(
          <Topbar
            onNavigation={jest.fn()}
            onSearch={jest.fn()}
            brandLabel={'test'}
            searchAreaItem={undefined}
            quickAccessItems={[]}
            onLoginClick={() => null}
            onSignUpClick={() => null}
            onLogout={() => null}
            onFeedbackClick={() => null}
            currentLocation={''}
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
