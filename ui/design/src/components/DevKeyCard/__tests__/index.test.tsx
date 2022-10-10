import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import DevKeyCard from '../';

import { sampleDevKey } from '../../../utils/dummy-data';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<DevKeyCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleCopyClick = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <DevKeyCard
            item={sampleDevKey}
            nonameLabel="Unnamed Key"
            unusedLabel="Unused"
            usedLabel="Used"
            pendingConfirmationLabel="Pending Confirmation"
            devPubKeyLabel="Dev Public Key 🔑"
            dateAddedLabel="Date added 🗓"
            onCopyClick={handleCopyClick}
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

  it('has correct key name', () => {
    const { getByText } = componentWrapper;
    const keyName = getByText(sampleDevKey.name);

    expect(keyName).toBeDefined();
  });

  it('has correct key usage label', async () => {
    const { getByText } = componentWrapper;

    const pendingLabel = getByText('Pending Confirmation');

    expect(pendingLabel).toBeDefined();
  });
});
