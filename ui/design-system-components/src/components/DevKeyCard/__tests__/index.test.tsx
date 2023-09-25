import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import { customRender } from '@akashaorg/design-system-core/lib/test-utils';

import DevKeyCard from '../';

import { sampleDevKey } from '../../../utils/dummy-data';

describe('<DevKeyCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <DevKeyCard
          item={sampleDevKey}
          nonameLabel="Unnamed Key"
          unusedLabel="Unused"
          usedLabel="Used"
          pendingConfirmationLabel="Pending Confirmation"
          devPublicKeyLabel="Dev Public Key 🔑"
          dateAddedLabel="Date added 🗓"
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
