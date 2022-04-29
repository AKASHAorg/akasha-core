import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import TransparencyLogBanner from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<TransparencyLogBanner /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const count = { kept: 12, delisted: 5 };

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <TransparencyLogBanner
            size="12.75rem"
            assetName="moderation-history-illustration"
            title="Moderation History"
            content="Here you will find the moderated posts, replies, and accounts of Ethereum World. We do not reveal any personal information of the author or submitter(s) to protect their privacy."
            keptCount={count.kept}
            keptCountLabel="kept"
            totalCountLabel="total"
            delistedCount={count.delisted}
            delistedCountLabel="delisted"
            footerLabel="Visit our Code of Conduct to learn more about our moderation criteria"
            footerLinkLabel="Code of Conduct"
            footerLink="https://akasha.ethereum.world/legal/code-of-conduct"
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

  it('has correct title', () => {
    const { getByText } = componentWrapper;
    const title = getByText('Moderation History');

    expect(title).toBeDefined();
  });

  it('renders correct total count', () => {
    const { getByText } = componentWrapper;
    const totalString = getByText(`${count.kept + count.delisted} total`);

    expect(totalString).toBeDefined();
  });
});
